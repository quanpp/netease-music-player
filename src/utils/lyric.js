const TIME_TAG = /\[(\d{2,3}):(\d{2})(?:[.:](\d{2,3}))?\]/g

export function parseLyric(lrc = '') {
  const lines = []
  if (!lrc) return lines 

  for (const raw of lrc.split('\n')) {
    // 一行可能有多个时间标签：[00:15.00][01:20.00]副歌重复
    const tags = [...raw.matchAll(TIME_TAG)]
    if (!tags.length) continue

    const text = raw.replace(TIME_TAG, '').trim()
    if (!text) continue

    for (const tag of tags) {
      const [, mm, ss, frac] = tag
      // 毫秒可能是 2 位（.50）也可能是 3 位（.500），统一补成 3 位
      const ms = frac ? Number(frac.padEnd(3, '0')) : 0
      lines.push({
        time: Number(mm) * 60 + Number(ss) + ms / 1000,    // 转换为秒
        text
      })
    }
  }

  return lines.sort((a, b) => a.time - b.time)
}