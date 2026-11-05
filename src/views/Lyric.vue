<script setup>
import { usePlayerStore } from '../stores/player'
import LyricView from '../components/LyricView.vue'

const player = usePlayerStore()
</script>

<template>
  <div class="lyric-page">
    <div class="head" v-if="player.currentSong">
      <h2>{{ player.currentSong.name }}</h2>
      <p>{{ player.currentSong.artists.map((a) => a.name).join(' / ') }}</p>
    </div>

    <LyricView
      :lines="player.lyricLines"
      :active-index="player.lyricIndex"
      @seek="player.seek"
    />
  </div>
</template>

<style scoped>
.lyric-page {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 160px);
}
.head {
  padding: 16px 0;
  text-align: center;
}
.head h2 { font-size: 18px; }
.head p { font-size: 12px; color: #888; margin-top: 4px; }
</style>
