<script setup>
import { computed } from 'vue'
import { fmt } from '../utils/format.js'
import { usePlayerStore } from '../stores/player.js'
import { RouterLink } from 'vue-router'

const player = usePlayerStore()

const modeText = computed(
  () => ({ loop: '循环', single: '单曲', random: '随机' })[player.mode]
)
</script>

<template>
  <div class="player" v-if="player.currentSong">
    <div class="row">
      <div class="info">
        <RouterLink class="meta" to="/player">
          <div class="name">{{ player.currentSong.name }}</div>
          <div class="artist">{{ player.currentSong.artists.map((a) => a.name).join(' / ') }}</div>
        </RouterLink>
      </div>
      <div class="controls">
        <button class="mode" @click="player.toggleMode()">{{ modeText }}</button>
        <button @click="player.prev">上一首</button>
        <button class="play" @click="player.toggle">{{ player.playing ? '暂停' : '播放' }}</button>
        <button @click="player.next">下一首</button>
        <button class="mode" @click="player.playlistVisible = !player.playlistVisible">
          列表 {{ player.queue.length }}
        </button>
        <div class="volume-wrap">
          <input
            class="volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            :value="player.volume"
            @input="player.setVolume(Number($event.target.value))"
          />
          <span class="volume-value">{{ Math.round(player.volume * 100) }}</span>
        </div>
      </div>
      <div class="time">{{ fmt(player.currentTime) }} / {{ fmt(player.duration) }}</div>
    </div>
    <input
      class="progress"
      type="range"
      min="0"
      :max="player.duration || 0"
      step="0.1"
      :value="player.currentTime"
      @input="player.seek($event.target.value)"
    />
  </div>
</template>

<style scoped>
.player {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 12px 24px 14px;
  background: rgba(20, 20, 26, 0.92);
  backdrop-filter: blur(20px);
  border-top: 1px solid var(--border);
}

.row {
  display: flex;
  align-items: center;
  gap: 20px;
}

.info {
  flex: 1;
  min-width: 0;
}

.meta {
  width: fit-content;
  max-width: 100%;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
}

.name {
  font-size: 14px;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.artist {
  font-size: 12px;
  color: var(--text-dim);
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.controls {
  display: flex;
  align-items: center;
  gap: 10px;
}

.controls button {
  padding: 7px 14px;
  border-radius: 99px;
  font-size: 12.5px;
  color: var(--text-dim);
  background: var(--bg-soft);
  transition: color 0.15s, background 0.15s;
}

.controls button:hover {
  color: var(--text);
  background: var(--bg-hover);
}

.controls .play {
  background: var(--primary);
  color: #fff;
  font-weight: 500;
}

.controls .play:hover {
  background: #f05f7b;
}

.time {
  font-size: 12px;
  color: var(--text-dim);
  font-variant-numeric: tabular-nums;
  min-width: 88px;
  text-align: right;
}

.progress,
.volume {
  height: 4px;
  accent-color: var(--primary);
  cursor: pointer;
}
.volume-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
}

.volume-value {
  font-size: 11px;
  color: var(--text-dim);
  width: 26px;
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.progress {
  width: 100%;
  margin-top: 10px;
}

.volume {
  width: 80px;
}

</style>