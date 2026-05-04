const defaultAvatar = 'http://localhost:8080/api/upload/default.png'

export const formatImageUrl = (url, isAvatar = false) => {
  if (!url) {
    return isAvatar ? defaultAvatar : ''
  }
  
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  if (url.startsWith('/upload')) {
    return `http://localhost:8080/api${url}`
  }
  
  return url
}

export const formatAvatarUrl = (url) => {
  return formatImageUrl(url, true)
}
