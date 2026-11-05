# 网易云音乐播放器

基于 Vue 3 + Vite 的网页音乐播放器，数据来自 NeteaseCloudMusicApi。

## 功能

- 发现页：推荐歌单、新歌速递
- 搜索：单曲搜索、搜索结果 URL 同步、热搜榜
- 歌单详情：封面、简介、播放全部
- 播放器：播放/暂停、上一首/下一首、进度拖拽、音量调节
- 播放模式：列表循环、单曲循环、随机播放
- 播放列表：抽屉管理、单曲删除
- 歌词：LRC 解析、逐行高亮、自动滚动、点击跳转
- 全屏播放页：唱片旋转、封面模糊背景、歌词并列
- 持久化：播放列表、当前索引、播放模式、音量存入 localStorage
- 响应式：桌面双栏、移动端单列

## 技术栈

Vue 3（`<script setup>`）· Vite · Vue Router 4 · Pinia · 原生 CSS

## 快速开始

需要 Node.js 18+，**要开两个终端**。

```bash
# 安装依赖
npm install

# 终端 1：启动 API 服务（3000 端口）
node server.js

# 终端 2：启动前端（5173 端口）
npm run dev
```

打开 <http://localhost:5173>

> ⚠️ 只启动 `npm run dev` 不够。前端所有请求走 `/api` 代理到 3000，API 没起来页面会一直空白。

## 目录结构

```
src/
├── api/                 接口封装
├── components/          复用组件
│   ├── PlayerBar.vue        播放条
│   ├── PlaylistPanel.vue    播放列表抽屉
│   ├── LyricView.vue        歌词滚动
│   └── Toast.vue            轻提示
├── views/               页面
│   ├── Home.vue             发现
│   ├── Search.vue           搜索
│   ├── PlaylistDetail.vue   歌单详情
│   └── FullPlayer.vue       全屏播放
├── stores/
│   └── player.js        播放器状态（核心）
├── utils/
│   ├── lyric.js             LRC 解析
│   ├── format.js            时间格式化
│   └── song.js              字段归一化
└── router/
```

## 实现要点

### 1. audio 单例放在 store 模块作用域

```js
const audio = new Audio()   // 不是 ref(new Audio())
```

`audio` 是浏览器对象，不需要响应式。放进 `ref` 会被 Proxy 包装，导致高频的 `timeupdate` 事件做无谓的依赖收集，还会让原生 API 的 `this` 指向错乱。

由于 audio 只有一份、播放条挂在 `App.vue` 层级，**切换页面时音乐不会中断**。

### 2. 切歌竞态用 id 比对丢弃过期响应

连续点「下一首」时，请求返回顺序可能和发出顺序不一致，晚回来的旧请求会把已经切走的歌塞回 `audio.src`。

```js
if (currentSong.value?.id !== songId) return   // 已经切歌了，丢弃
```

歌词加载同理。

### 3. 歌词时间轴用二分查找

`timeupdate` 每秒触发约 4 次，每次都要定位当前行。歌词通常几百行，二分比线性扫描稳定：

```js
while (lo <= hi) {
  const mid = (lo + hi) >> 1
  if (list[mid].time <= t) { ans = mid; lo = mid + 1 }
  else { hi = mid - 1 }
}
```

前提是歌词数组按时间升序（解析时 `sort` 保证）。

### 4. 歌词滚动需要等 DOM 更新

`activeIndex` 变化后，当前行会加粗放大，高度也变。不等 DOM 更新就量 `offsetTop`，拿到的是旧位置。

```js
await nextTick()
box.scrollTo({ top: el.offsetTop - box.clientHeight / 2 + el.clientHeight / 2 })
```

### 5. 索引与 id 分工

| 存什么                 | 用途         |
| ------------------- | ---------- |
| `currentSong`（含 id） | 界面显示「哪首在播」 |
| `currentIndex`      | 算下一首 / 上一首 |

删除歌曲时必须维护 `currentIndex`：删当前曲之前 → 减 1；删当前曲 → 播下一首；删之后 → 不动。

### 6. 不同接口字段名不同，边界处归一化

搜索接口返回 `artists` / `album`，歌单接口返回 `ar` / `al`。写一个 `toSong()` 统一，下游只认一种结构。

## 已知限制

- **部分歌曲无法播放**：VIP / 独家歌曲接口返回 `url: null`，UI 会提示「这首没版权」，不会静默失败。
- **API 服务需本地运行**：网易云私有接口封装，不能公开部署，仅供本地学习。
- **未实现登录**：接入扫码登录后可播放 VIP 歌曲、读取个人歌单。

## 说明

接口来自开源项目 [NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi)，音乐版权归网易云音乐及版权方所有。本项目仅用于前端技术学习。
