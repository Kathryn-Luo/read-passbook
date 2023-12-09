interface propsType {
  search: string;
  startIndex: number;
  maxResults: number;
}
export const searchFromGoogleBook = async ({
  search,
  startIndex,
  maxResults
}: propsType) => {
  if (!search) return
  const result = await $fetch('https://www.googleapis.com/books/v1/volumes', {
    method: 'GET',
    params: {
      q: search,
      startIndex,
      maxResults
    }
  }).catch(error => {
    console.log('error', error)
  })
  console.log('result', result)
  return result
}