<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usePlayerStore } from '../stores/player'
import { toSong } from '../utils/song'

const route = useRoute()
const player = usePlayerStore()

const info = ref(null)
const songs = ref([])

onMounted(async () => {
  const id = route.params.id
  const [d, t] = await Promise.all([
    fetch('/api/playlist/detail?id=' + id).then((r) => r.json()),
    fetch('/api/playlist/track/all?id=' + id + '&limit=500').then((r) => r.json())
  ])
  info.value = d.playlist
  songs.value = (t.songs || []).map((item) => toSong(item))
})
</script>

<template>
  <div v-if="info">
    <header class="head">
      <img :src="info.coverImgUrl + '?param=200y200'" class="cover" alt="" />
      <div class="meta">
        <h2>{{ info.name }}</h2>
        <p>{{ info.trackCount }} 首 · {{ info.creator?.nickname }}</p>
        <button class="play-all" @click="player.playList(songs, 0)">
          播放全部
        </button>
      </div>
    </header>

    <ul class="song-list">
      <li
        v-for="(song, i) in songs"
        :key="song.id"
        class="song-item"
        :class="{ active: player.currentSong?.id === song.id }"
        @click="player.playList(songs, i)"
      >
        {{ song.name }}
        <span>— {{ song.artists.map((a) => a.name).join(' / ') }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.head {
  display: flex;
  gap: 20px;
  align-items: flex-end;
  padding: 24px 0 20px;
}
.cover {
  width: 160px;
  height: 160px;
  border-radius: 12px;
  object-fit: cover;
}
.meta h2 { font-size: 22px; margin-bottom: 8px; }
.meta p { font-size: 12px; color: #888; margin-bottom: 14px; }
.play-all {
  padding: 8px 20px;
  border-radius: 99px;
  border: none;
  background: #e94b6a;
  color: #fff;
  cursor: pointer;
}

span { color: #888; font-size: 13px; }
</style>