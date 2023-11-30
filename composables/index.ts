export * from './firebase/auth'
export * from './firebase/book'
export * from './firebase/storage'

export const urlHttpToHttps = (url: string) => {
  return url.replace(/^http\:/, 'https:')
}

export const getFixedImageUrlFromFirestore = (imageUrl: string): string => {
  // 為了修正 Nuxt/image 加上 domains 後產生的問題
  // TODO: 確認後續版本是否修正，並跟著調整
  if (imageUrl && imageUrl.indexOf('http') === -1) return imageUrl
  const splicedImgUrl = imageUrl.replace('https://firebasestorage.googleapis.com/v0/b/read-passbook.appspot.com/o/', '')
  const encodedImagePath = encodeURIComponent(splicedImgUrl)
  const fixedUrl = 'https://firebasestorage.googleapis.com/v0/b/read-passbook.appspot.com/o/' + encodedImagePath
  return fixedUrl
}

export const getLinesTextFromTextarea = (text: string): string[] => {
  if (!text) return []
  return text.split('\n')
}