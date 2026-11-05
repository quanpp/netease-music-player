export function toSong(s) {
  return {
    id: s.id,
    name: s.name,
    artists: s.artists || s.ar || [],
    album: s.album || s.al || {},
    duration: s.duration || s.dt || 0
  }
}
