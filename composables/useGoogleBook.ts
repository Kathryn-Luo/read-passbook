export const searchFromGoogleBook = async (search: string) => {
  if (!search) return
  const result = await $fetch('https://www.googleapis.com/books/v1/volumes', {
    method: 'GET',
    params: {
      q: search,
    }
  }).catch(error => {
    console.log('error', error)
  })
  console.log('result', result)
  return result
}