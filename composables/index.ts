export * from './firebase/auth'
export * from './firebase/book'
export * from './firebase/storage'

export const urlHttpToHttps = (url: string) => {
  return url.replace(/^http\:/, 'https:')
}

export const getFixedImageUrl = (imageUrl: string, imagePrefixUrl: string): string => {
  // 為了修正 Nuxt/image 加上 domains 後產生的問題
  // TODO: 確認後續版本是否修正，並跟著調整

  if (imageUrl && imageUrl.indexOf('http') === -1) return imageUrl
  const splicedImgUrl = imageUrl.replace(imagePrefixUrl, '')
  const encodedImagePath = encodeURIComponent(splicedImgUrl)
  const fixedUrl = imagePrefixUrl + encodedImagePath
  return fixedUrl
}

export const getFixedImageUrlFromFirestore = (imageUrl: string): string => {
  const config = useRuntimeConfig()

  const fixedUrl = getFixedImageUrl(imageUrl, config.public.firestoreImagePrefixUrl)
  return fixedUrl
}

export const getFixedImageUrlFromGoogleBookApi = (imageUrl: string): string => {
  const config = useRuntimeConfig()

  const fixedUrl = getFixedImageUrl(imageUrl, config.public.googleBookImagePrefixUrl)
  return fixedUrl
}

export const getLinesTextFromTextarea = (text: string): string[] => {
  if (!text) return []
  return text.split('\n')
}