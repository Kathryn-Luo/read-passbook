export * from './firebase/auth'
export * from './firebase/book'

export const urlHttpToHttps = (url: string) => {
  return url.replace(/^http\:/, 'https:')
}