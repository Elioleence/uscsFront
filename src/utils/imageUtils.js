const baseUrl = import.meta.env.VITE_SERVER_URL
const defaultAvatar = `${baseUrl}/upload/default.png`

export const formatImageUrl = (url, isAvatar = false) => {
  if (!url) {
    return isAvatar ? defaultAvatar : ''
  }
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  if (url.startsWith('/upload')) {
    return `${baseUrl}${url}`
  }
  
  return url
}

export const formatAvatarUrl = (url) => {
  return formatImageUrl(url, true)
}
