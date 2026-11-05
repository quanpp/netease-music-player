<script setup>
import PlayerBar from './components/PlayerBar.vue'
import PlaylistPanel from './components/PlaylistPanel.vue'
import Toast from './components/Toast.vue'
</script>

<template>
  <div class="app">
    <nav class="nav">
      <RouterLink to="/">发现</RouterLink>
      <RouterLink to="/search">搜索</RouterLink>
      <RouterLink to="/lyric">歌词</RouterLink>
    </nav>
    <RouterView />
    <!-- <div v-if="currentSong" class="player">
      <div class="info">
        <div class="name">{{ currentSong.name }}</div>
        <div class="artist">{{ currentSong.artists.map((a) => a.name).join(' / ') }}</div>
      </div>
      <div class="controls">
      <button @click="prev">上一首</button>
      <button class="play" @click="toggle">{{ playing ? '暂停' : '播放' }}</button>
      <button @click="next">下一首</button>
      </div>
      <div class="time">{{ fmt(currentTime) }} / {{ fmt(duration) }}</div>
    </div> -->

    <PlayerBar />
    <Toast />
    <PlaylistPanel />
  </div>
</template>

<style scoped>
.app { padding: 0 24px 110px; }

.nav {
  display: flex;
  gap: 4px;
  padding: 16px 0;
  border-bottom: 1px solid var(--border);
}

.nav a {
  padding: 7px 16px;
  border-radius: 99px;
  font-size: 13px;
  color: var(--text-dim);
  text-decoration: none;
  transition: color 0.15s, background 0.15s;
}

.nav a:hover {
  color: var(--text);
  background: var(--bg-soft);
}

.nav a.router-link-active {
  color: #fff;
  background: var(--primary);
}

</style>