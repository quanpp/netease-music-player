<script setup>
import { useRouter } from 'vue-router'
import { usePlayerStore } from '../stores/player'
import LyricView from '../components/LyricView.vue'
import { fmt } from '../utils/format'

const router = useRouter()
const player = usePlayerStore()
</script>

<template>
  <div v-if="player.currentSong" class="full-player">
    <div
      class="bg"
      :style="{ backgroundImage: `url(${player.currentSong.album?.picUrl}?param=600y600)` }"
    />
    <div class="mask" />

    <header class="top">
      <button class="back" @click="router.back()">收起</button>
      <p class="ellipsis">{{ player.currentSong.name }}</p>
      <span class="placeholder" />
    </header>

    <main class="body">
      <div class="disc" :class="{ playing: player.playing }">
        <img
          v-if="player.currentSong.album?.picUrl"
          :src="player.currentSong.album.picUrl + '?param=500y500'"
          alt=""
        />
        <div class="hole" />
      </div>

      <LyricView
        :lines="player.lyricLines"
        :active-index="player.lyricIndex"
        @seek="player.seek"
      />
    </main>

    <footer class="bottom">
      <div class="timeline">
        <span>{{ fmt(player.currentTime) }}</span>
        <input
          class="progress"
          type="range"
          min="0"
          :max="player.duration || 0"
          step="0.1"
          :value="player.currentTime"
          @input="player.seek(Number($event.target.value))"
        />
        <span>{{ fmt(player.duration) }}</span>
      </div>

      <div class="controls">
        <button @click="player.prev()">上一首</button>
        <button class="play" @click="player.toggle()">
          {{ player.playing ? '暂停' : '播放' }}
        </button>
        <button @click="player.next()">下一首</button>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.full-player {
  position: fixed;
  inset: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  background: #0b0b0f;
  color: #fff;
}

.bg {
  position: absolute;
  inset: -60px;
  background-size: cover;
  background-position: center;
  filter: blur(70px) brightness(0.5);
  transform: scale(1.2);
}

.mask {
  position: absolute;
  inset: 0;
  background: radial-gradient(70% 50% at 50% 0%, rgba(11, 11, 15, 0.3), rgba(11, 11, 15, 0.9));
}

.top {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 24px 8px;
}

.back {
  color: rgba(255, 255, 255, 0.7);
  font-size: 13px;
}

.top p {
  flex: 1;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
}

.placeholder {
  width: 40px;
}

.body {
  position: relative;
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 10px 56px;
  align-items: center;
  min-height: 0;
}

.disc {
  position: relative;
  width: min(40vh, 300px);
  aspect-ratio: 1;
  margin: 0 auto;
  border-radius: 50%;
  padding: 10px;
  background: radial-gradient(circle, #1b1b22 60%, #0d0d11);
  box-shadow: 0 30px 70px rgba(0, 0, 0, 0.6);
  animation: spin 24s linear infinite;
  animation-play-state: paused;
}

.disc.playing {
  animation-play-state: running;
}

.disc img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.hole {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 16%;
  height: 16%;
  border-radius: 50%;
  background: #0b0b0f;
  border: 2px solid rgba(255, 255, 255, 0.12);
  transform: translate(-50%, -50%);
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.bottom {
  position: relative;
  padding: 8px 56px 32px;
}

.timeline {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 640px;
  margin: 0 auto;
}

.timeline span {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  font-variant-numeric: tabular-nums;
  width: 38px;
  text-align: center;
}

.progress {
  flex: 1;
  height: 4px;
  accent-color: var(--primary);
  cursor: pointer;
}

.controls {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 16px;
}

.controls button {
  padding: 8px 22px;
  border-radius: 99px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(255, 255, 255, 0.08);
}

.controls .play {
  background: var(--primary);
  color: #fff;
  padding: 8px 32px;
}

@media (max-width: 860px) {
  .body {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
    padding: 0 24px;
    gap: 20px;
  }
  .disc {
    width: min(46vw, 200px);
  }
  .bottom {
    padding: 8px 24px 24px;
  }
}
</style>
