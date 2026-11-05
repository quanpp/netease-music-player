<script setup>
import { ref, onMounted } from 'vue'

const list = ref([])

onMounted(async () => {
  try {
    const res = await fetch('/api/personalized?limit=12')  // 获取推荐歌单列表，limit取出数量
    const json = await res.json()
    list.value = json.result
  } catch (err) {
    console.log('获取推荐歌单失败:', err)
  }
})
</script>

<template>
  <div>
    <h2 class="title">推荐歌单</h2>
    <div class="grid">
      <RouterLink
        v-for="item in list"
        :key="item.id"
        :to="`/playlist/${item.id}`"
        class="card"
      >
        <img :src="item.picUrl + '?param=300y300'" :alt="item.name" />
        <p>{{ item.name }}</p>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.title { margin: 20px 0 14px; font-size: 20px; }
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 18px 14px;
}
.card { color: inherit; text-decoration: none; }
.card img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 12px;
}
.card p {
  margin-top: 6px;
  font-size: 12px;
  color: var(--text-dim);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>