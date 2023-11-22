<script setup>
const nuxtApp = useNuxtApp()
const route = useRoute()
const bookId = route.params.bookId
if (!bookId) {
  throw new Error('網址錯誤')
}
const { data: bookDetail, pending: bookPending } = await useLazyAsyncData(`book:${bookId}`, async () => {
  const result = await getBook(bookId)
  return result
}, {
  transform(input) {
    return {
      ...input,
      fetchedAt: new Date()
    }
  },
  getCachedData(key) {
    const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    // If data is not fetched yet
    if (!data) {
      // Fetch the first time
      return
    }

    // Is the data too old?
    const expirationDate = new Date(data.fetchedAt)
    expirationDate.setTime(expirationDate.getTime() + 30 * 1000)
    const isExpired = expirationDate.getTime() < Date.now()
    if(isExpired) {
      // Refetch the data
      return
    }

    return data
  },
})
const imageUrl = `https://books.google.com/books/publisher/content/images/frontcover/${bookId}?fife=w400-h600&source=gbs_api`
useSeoMeta({
  title: () => bookDetail.value?.volumeInfo?.title,
  ogTitle: () => bookDetail.value?.volumeInfo?.title,
  description: () => bookDetail.value?.volumeInfo?.description,
  ogDescription: () => bookDetail.value?.volumeInfo?.description,
  ogImage: () => imageUrl,
})

const isOnSale = () => {
  const listPrice = bookDetail.value?.saleInfo?.listPrice?.amount
  const retailPrice = bookDetail.value?.saleInfo?.retailPrice?.amount
  if (!listPrice || !retailPrice) return false
  return retailPrice < listPrice
}

</script>

<template>
  <div>
    <div class="flex mb-4">
      <div class="flex flex-col justify-between flex-1 pr-5 pt-3">
        <div v-if="bookPending"
          class=" w-full flex justify-center py-20"
          >
          <q-circular-progress
            indeterminate
            rounded
            size="50px"
            color="light-blue"
            class="q-ma-md"
          />
        </div>
        <template v-else>
          <div>
            <h1 v-if="bookDetail?.volumeInfo?.title" class=" mb-2 text-2xl font-bold">
              {{ bookDetail?.volumeInfo?.title  }}
            </h1>
            <p v-if="bookDetail?.volumeInfo?.authors?.length">
              作者：{{ bookDetail?.volumeInfo?.authors.join(', ') }}
            </p>
            <p v-if="bookDetail?.volumeInfo?.publisher">
              出版社：{{ bookDetail?.volumeInfo?.publisher }}
            </p>
            <p v-if="bookDetail?.volumeInfo?.publishedDate">
              出版日期：{{ bookDetail?.volumeInfo?.publishedDate }}
            </p>
          </div>
          <div class=" bg-stone-200 rounded p-2">
            <p v-if="bookDetail?.saleInfo?.listPrice" class="mb-1">
              售價：
              <span :class="`${isOnSale() ? 'line-through text-gray-400' : ''}`">
                {{ bookDetail?.saleInfo?.listPrice?.currencyCode }} {{ bookDetail?.saleInfo?.listPrice.amount }}
              </span>
              <span v-if="isOnSale()" class=" ml-2 text-rose-600 font-bold">
                {{ bookDetail?.saleInfo?.retailPrice?.currencyCode }} {{ bookDetail?.saleInfo?.retailPrice.amount }}
              </span>
            </p>
            <div class=" flex justify-between">
              <div>
                <q-btn
                  v-if="bookDetail?.saleInfo?.buyLink"
                  :href="bookDetail?.saleInfo?.buyLink"
                  outline
                  label="前往購買"
                  target="_blank"
                  size="sm"
                  icon-right="las la-external-link-alt"
                  />
                <q-btn
                  v-if="bookDetail?.accessInfo?.webReaderLink"
                  :href="bookDetail?.accessInfo?.webReaderLink"
                  class=" ml-2"
                  outline
                  label="前往試閱"
                  target="_blank"
                  size="sm"
                  icon-right="las la-external-link-alt"
                  />
              </div>
              <span class=" self-end text-gray-400 text-sm">
                Google 圖書 提供
              </span>
            </div>
          </div>
        </template>
      </div>
      <div class="flex-none">
        <NuxtImg
          v-if="imageUrl || bookDetail.imageLinks?.thumbnail"
          :src="imageUrl || bookDetail.imageLinks?.thumbnail"
        />
      </div>
    </div>
    <div>
      <p>
        {{ bookDetail?.volumeInfo?.description }}
      </p>
    </div>
  </div>
</template>