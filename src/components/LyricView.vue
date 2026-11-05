<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  lines: { type: Array, default: () => [] },
  activeIndex: { type: Number, default: -1 }
})
const emit = defineEmits(['seek'])

const boxRef = ref(null)    
const lineRefs = ref([])    // 所有歌词的dom元素

function setRef(el, i) {
  if (el) lineRefs.value[i] = el
}

watch(
  () => props.activeIndex,
  async (i) => {
    if (i < 0) return
    await nextTick()               // 等 DOM 渲染完再滚
    const box = boxRef.value   // 歌词容器 
    const el = lineRefs.value[i]    // 当前行歌词元素
    if (!box || !el) return  
    box.scrollTo({
      top: el.offsetTop - box.clientHeight / 2 + el.clientHeight / 2,
      behavior: 'smooth'
    })
  }
)
</script>

<template>
  <div ref="boxRef" class="lyric">
    <p
      v-for="(line, i) in lines"
      :key="i"
      :ref="(el) => setRef(el, i)"
      :class="{ active: i === activeIndex }"
      @click="emit('seek', line.time)"
    >
      {{ line.text }}
    </p>
  </div>
</template>

<style scoped>
.lyric {
  height: 100%;
  overflow-y: auto;
  padding: 0 16px;
  scrollbar-width: none;
}
.lyric::-webkit-scrollbar { display: none; }

.lyric p {
  padding: 10px 0;
  font-size: 14px;
  line-height: 1.6;
  color: #666;
  text-align: center;
  cursor: pointer;
  transition: color 0.2s, transform 0.2s;
}
.lyric p:hover { color: #aaa; }
.lyric p.active {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  transform: scale(1.02);
}
</style>
