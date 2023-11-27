export * from './firebase/auth'
export * from './firebase/book'
export * from './firebase/storage'

export const urlHttpToHttps = (url: string) => {
  return url.replace(/^http\:/, 'https:')
}