export const convertBytes = (bytes) => {
  if(bytes<=1024) return bytes + "B"
  bytes /= 1024
  if(bytes<=1024) return Math.round(bytes * 100) / 100 + " kB"
  bytes /= 1024
  if(bytes<=1024) return Math.round(bytes * 100) / 100 + " MB"
  bytes /= 1024
  if(bytes<=1024) return Math.round(bytes * 100) / 100 + " GB"
  bytes /= 1024
  if(bytes<=1024) return Math.round(bytes * 100) / 100 + " TB"
  return "too much bytes"
}