// 播放器状态管理，包括播放队列、当前播放歌曲、当前播放时间、歌曲总时长
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { toSong } from '../utils/song'
import { parseLyric } from '../utils/lyric'

export const usePlayerStore = defineStore('player', () => {
  function loadSaved() {
    try {
      return JSON.parse(localStorage.getItem('player') || '{}')
    } catch {
      return {}
    }
  }
  const saved = loadSaved()

  const queue = ref(saved.queue || [])
  const currentIndex = ref(saved.currentIndex ?? -1) // 当前播放的下标
  const currentSong = computed(() => queue.value[currentIndex.value]) // 根据 currentIndex 变化而变化
  const playing = ref(false)
  const currentTime = ref(0)
  const duration = ref(0) // 歌曲总时长
  const mode = ref(saved.mode || 'loop') // loop | single | random
  const playlistVisible = ref(false)
  const volume = ref(saved.volume ?? 1)
  const lyricLines = ref([])

  const audio = new Audio()

  // 将整张列表加入播放队列，并从指定下标开始播放
  async function playList(songs, index) {
    queue.value = songs.map((item) => toSong(item))

    // 如果点击的正好是正在播放的歌曲，则不重新播放
    if (currentIndex.value === index) {
      return
    }

    playAt(index)
  }

  // 根据下标播放对应歌曲
  async function playAt(index) {
    const song = queue.value[index]
    if (!song) {
      return
    }

    try {
      const res = await fetch(`/api/song/url?id=${song.id}`)
      const json = await res.json()
      const url = json.data?.[0]?.url

      if (!url) {
        showToast('这首歌没有版权，换一首试试')
        return
      }

      currentIndex.value = index
      audio.src = url
      await audio.play()
      loadLyric(song.id)
    } catch (err) {
      console.log('播放失败:', err)
    }
  }

  // 监听播放器事件，同步播放状态与时间
  audio.addEventListener('timeupdate', () => {
    currentTime.value = audio.currentTime
  })
  audio.addEventListener('loadedmetadata', () => {
    duration.value = Number.isFinite(audio.duration) ? audio.duration : 0
  })
  audio.addEventListener('play', () => {
    playing.value = true
  })
  audio.addEventListener('pause', () => {
    playing.value = false
  })
  audio.addEventListener('ended', () => {
    next(true)
  })

  // 播放 / 暂停切换
  function toggle() {
    if (!currentSong.value) {
      return
    }
    if (!audio.src) {
      playAt(currentIndex.value)
      return
    }
    playing.value ? audio.pause() : audio.play()
  }

  // 下一首
  function next(auto = false) {
    if (!queue.value.length) return

    // 单曲循环：只有自动播完才重播，手动点下一首还是要换歌
    if (mode.value === 'single' && auto) {
      audio.currentTime = 0
      audio.play()
      return
    }

    // 随机：随机挑一首，可能挑到自己
    if (mode.value === 'random') {
      playAt(Math.floor(Math.random() * queue.value.length))
      return
    }

    // 列表循环
    playAt((currentIndex.value + 1) % queue.value.length)
  }

  // 上一首
  function prev() {
    if (!queue.value.length) {
      return
    }
    playAt((currentIndex.value - 1 + queue.value.length) % queue.value.length)
  }

  // 跳转进度
  const seek = (t) => {
    audio.currentTime = t
    currentTime.value = t
  }

  // 切换播放模式
  function toggleMode() {
    const modes = ['loop', 'single', 'random']
    const i = modes.indexOf(mode.value)
    mode.value = modes[(i + 1) % modes.length]
  }

  // 删除指定下标的歌曲
  function removeAt(index) {
    if (index < 0 || index >= queue.value.length) return

    const isCurrent = index === currentIndex.value
    queue.value.splice(index, 1)

    // 删空了
    if (!queue.value.length) {
      currentIndex.value = -1
      audio.pause()
      audio.src = ''
      return
    }

    if (index < currentIndex.value) {
      // 删的是当前歌前面的 → 索引整体前移一位
      currentIndex.value--
    } else if (isCurrent) {
      // 删的就是当前这首 → 接着播下一首（如果删的是最后一首，回到新的最后一首）
      playAt(Math.min(index, queue.value.length - 1))
    }
    // 删的是后面的 → 索引不用动
  }

  // 加载歌词
  async function loadLyric(songId) {
    lyricLines.value = []
    try {
      const res = await fetch('/api/lyric?id=' + songId)
      const json = await res.json()
      // 竞态保护：请求回来时可能已经切歌了
      if (currentSong.value?.id !== songId) return
      lyricLines.value = parseLyric(json?.lrc?.lyric || '')    // 传入歌词字符串,包含时间标签和歌词，处理后返回数组，每个元素为{time, text}对象
    } catch {
      lyricLines.value = []
    }
  }

  // 计算当前时间对应的歌词索引
  const lyricIndex = computed(() => {
    const list = lyricLines.value
    if (!list.length) return -1

    const t = currentTime.value    // 当前时间
    let lo = 0
    let hi = list.length - 1
    let ans = -1

    while (lo <= hi) {
      const mid = (lo + hi) >> 1
      if (list[mid].time <= t) {
        ans = mid
        lo = mid + 1
      } else {
        hi = mid - 1
      }
    }
    return ans
  })

  // 音量
  function setVolume(v) {
    volume.value = Math.max(0, Math.min(1, v))
    audio.volume = volume.value
  }

  // 监听改变，本地储存
  watch(
    [queue, currentIndex, mode, volume],
    () => {
      localStorage.setItem(
        'player',
        JSON.stringify({
          queue: queue.value,
          currentIndex: currentIndex.value,
          mode: mode.value,
          volume: volume.value
        })
      )
    },
    { deep: true }
  )

  // toast状态提示信息，和定时器
  const toast = ref('')
  let toastTimer = null

  function showToast(msg, duration = 2400) {
    toast.value = msg
    clearTimeout(toastTimer)
    toastTimer = setTimeout(() => {
      toast.value = ''
    }, duration)
  }

  return {
    queue,
    currentIndex,
    playing,
    currentTime,
    duration,
    currentSong,
    playList,
    playAt,
    toggle,
    next,
    prev,
    seek,
    toggleMode,
    mode,
    playlistVisible,
    removeAt,
    lyricLines,
    lyricIndex,
    volume,
    setVolume,
    toast,
    showToast
  }
})