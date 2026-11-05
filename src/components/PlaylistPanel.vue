<script setup>
import { usePlayerStore } from '../stores/player'

const player = usePlayerStore()
</script>

<template>
  <div v-if="player.playlistVisible" class="mask" @click="player.playlistVisible = false">
    <aside class="panel" @click.stop>
      <header class="head">
        <h3>播放列表（{{ player.queue.length }}）</h3>
        <button class="close" @click="player.playlistVisible = false">×</button>
      </header>

      <ul>
        <li
          v-for="(song, i) in player.queue"
          :key="song.id"
          :class="{ active: player.currentSong?.id === song.id }"
          @click="player.playAt(i)"
        >
          <span class="idx">{{ i + 1 }}</span>
          <span class="name">{{ song.name }}</span>
          <span class="artist">{{ song.artists.map((a) => a.name).join(' / ') }}</span>
          <button class="del" @click.stop="player.removeAt(i)">×</button>
        </li>
      </ul>
    </aside>
  </div>
</template>

<style scoped>
.mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
}
.panel {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 360px;
  max-width: 86vw;
  background: #161616;
  border-left: 1px solid #2a2a2a;
  display: flex;
  flex-direction: column;
}
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 18px;
  border-bottom: 1px solid #2a2a2a;
}
.head h3 { font-size: 15px; }
.close {
  border: none;
  background: none;
  color: #888;
  font-size: 20px;
  cursor: pointer;
}
ul {
  list-style: none;
  padding: 6px 8px;
  margin: 0;
  overflow-y: auto;
  flex: 1;
}
li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 13px;
}
li:hover { background: #222; }
li.active .name { color: #e94b6a; }
.idx { width: 20px; color: #666; font-size: 11px; text-align: center; }
.name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.artist {
  width: 90px;
  color: #777;
  font-size: 11px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.del {
  border: none;
  background: none;
  color: #666;
  cursor: pointer;
  opacity: 0;
  font-size: 16px;
}
li:hover .del { opacity: 1; }
</style>
