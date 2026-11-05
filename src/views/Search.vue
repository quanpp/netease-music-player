<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePlayerStore } from '../stores/player'

const route = useRoute()
const router = useRouter()
const player = usePlayerStore()

const keyword = ref(route.query.q || '')
const songs = ref([])

async function search() {
  try {
    const url = `/api/search?keywords=${keyword.value}`
    const res = await fetch(url)   // 发送请求，返回响应对象
    const json = await res.json()  // 解析响应体，返回 JSON 对象
    songs.value = json.result.songs
    router.replace({ query: { q: keyword.value } })
  } catch (err) {
    console.log('搜索失败:', err)
  }
}

onMounted(search)   // ？？？

// 从别处带 ?q=xxx 跳过来时，跟着更新
watch(
  () => route.query.q,
  (newVal) => {
    if (newVal && newVal !== keyword.value) {
      keyword.value = newVal
      search()
    }
  }
)
</script>

<template>
  <div>
    <div class="search">
      <input v-model="keyword" @keyup.enter="search" placeholder="请输入搜索内容"/>
      <button @click="search">搜索</button>
    </div>

    <ul class="song-list">
      <li
        v-for="(song, index) in songs"
        :key="song.id"
        class="song-item"
        :class="{ active: player.currentSong?.id === song.id }"
        @click="player.playList(songs, index)"
      >
        {{ song.name }}
        <span>— {{ song.artists.map((a) => a.name).join(' / ') }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.search { display: flex; gap: 8px; margin: 20px 0 16px; }
input {
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid #444;
  background: #222;
  color: #eee;
}
button {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  background: #333;
  color: #eee;
  cursor: pointer;
}

span { color: #888; font-size: 13px; }
</style>
