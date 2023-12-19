<script setup>
  const recentlyBooksCookie = useCookie('recentlyBooksCookie', { maxAge: 30 })
  const cookieRecentlyBooks = recentlyBooksCookie.value
  const recentlyBookList = ref([])
  const pageOption = ref({
    prePageCount: 20,
    startIndex: 0,
  })

  const getRecentlyBooks = async () => {
    if (cookieRecentlyBooks && cookieRecentlyBooks?.length) {
      return cookieRecentlyBooks
    }
    try {
      const firestoreRecentlyBooks = await getRecentlyUserReadBooks({
        prePage: pageOption.value.prePageCount,
        lastDoc: recentlyBookList.value[recentlyBookList.value.length - 1] || null
      })
      return firestoreRecentlyBooks
    } catch (error) {
      console.log('catch', error)
    }
  }
  const {
    data: recentlyBooks = [],
    refresh: recentlyBooksRefresh,
  } = await useAsyncData(`recentlyBooks:${pageOption.value.startIndex}`, async () => {
    const result = await getRecentlyBooks(pageOption.value.startIndex)
    return result
  }, {
    server: false,
    immediate: false
  })

  const loadRcentlyBookList = async () => {
    await recentlyBooksRefresh()
    recentlyBookList.value.push(...recentlyBooks.value)
    recentlyBooksCookie.value = recentlyBookList.value
  }

  const onLoad = async (page, done) => {
    pageOption.value.startIndex += pageOption.value.prePageCount
    await loadRcentlyBookList()
    const finish = recentlyBooks.value.length === 0
    done(finish)
  }
  const refresh = async (done) => {
    recentlyBookList.value.length = 0
    pageOption.value.startIndex = 0
    await loadRcentlyBookList()
    done()
  }
</script>

<template>
  <div>
    <p class=" mb-2 text-lg text-cyan-800 font-bold">
      最近閱讀
    </p>
    <q-pull-to-refresh @refresh="refresh">
      <q-infinite-scroll
        @load="onLoad"
        :offset="250">
        <Book 
          v-for="book in recentlyBookList"
          :key="book.bookId"
          :book="book"
          :show-user="true"
          />
        <template v-slot:loading>
          <div class="row justify-center q-my-md">
            <q-spinner-dots color="primary" size="40px" />
          </div>
        </template>
      </q-infinite-scroll>
    </q-pull-to-refresh>
  </div>
</template>