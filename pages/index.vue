<script setup>
  const recentlyBooksCookie = useCookie('recentlyBooksCookie', { maxAge: 30 })
  const cookieRecentlyBooks = recentlyBooksCookie.value

  const getRecentlyBooks = async () => {
    if (cookieRecentlyBooks && cookieRecentlyBooks?.length) {
      return cookieRecentlyBooks
    }
    try {
      const firestoreRecentlyBooks = await getRecentlyUserReadBooks()
      recentlyBooksCookie.value = firestoreRecentlyBooks
      return firestoreRecentlyBooks
    } catch (error) {
      console.log('catch', error)
    }
  }
  const { data: recentlyBooks, pending  } = await useAsyncData('recentlyBooks', async () => {
    const result = await getRecentlyBooks()
    return result
  }, {
    server: false,
  })
</script>

<template>
  <div>
    <p class=" mb-2 text-lg text-cyan-800 font-bold">
      最近閱讀
    </p>
    <div
      v-for="book in recentlyBooks"
      :key="book.bookId"
      class="px-3 py-2 mb-4 group/item rounded transition duration-300 bg-zinc-100 hover:bg-zinc-300"
      >
      <nuxt-link
        :to="{ name: 'book-bookId', params: { bookId: book.bookId } }"
        class="flex group/book rounded text-base leading-5 transition  duration-300"
        >
        <div
          v-if="book.imageLinks"
          class="flex-none mr-2"
          :style="{
            width: 100
          }"
          >
          <NuxtImg
            :src="book.imageLinks.smallThumbnail || book.imageLinks.thumbnail"
            fit="contain"
          />
        </div>
        <div class="flex-1">
          <p class=" font-bold group-hover/book:underline group-hover/book:text-cyan-700">
            {{ book.title }}
          </p>
          <p
            v-if="book.authors?.length"
            class=" text-sm"
            >
            {{ book.authors.join(', ') }}
          </p>
          <p
            v-if="book.publisher"
            class=" text-xs text-zinc-600"
            >
            {{ book.publisher }}
          </p>
        </div>
      </nuxt-link>
      <div
        v-if="book.userDetail"
        class="group/user mt-2 border-t border-double "
        >
        <nuxt-link
          :to="{
            name: 'user-account',
            params: { account: book.userDetail.account }
          }"
          class=" text-right"
          >
          <p>
            <span class="mr-2 font-bold group-hover/user:underline group-hover/user:text-cyan-700">
              {{ book.userDetail.displayName }}
            </span>
            正在閱讀
          </p>
          <NuxtImg
            v-if="book.userDetail.image"
            :src="book.userDetail.image || ''"
            />
        </nuxt-link>
      </div>
    </div>
  </div>
</template>