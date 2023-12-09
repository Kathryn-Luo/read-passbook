<script setup>
  const $q = useQuasar()

  const dialogOpen = defineModel()
  const emit = defineEmits(['submit'])

  const searchText = ref(null)
  const searchInputRef = ref(null)
  const selection = ref([])
  
  const bookList = ref([])
  const pageOption = ref({
    prePageCount: 10,
    startIndex: 0,
    totalCount: 0
  })

  const clearSearch = () => {
    selection.value.length = 0
    searchText.value = null
    bookList.value.length = 0
  }
  const getBookListFromResult = (result) => {
    return result.map(book => ({
      id: book.id,
      ...book,
    }))
  }
  const hasNextPage = computed(() => {
    return pageOption.value.startIndex + pageOption.value.prePageCount < pageOption.value.totalCount
  })


  const {
    data: searchResult,
    refresh: searchRefresh,
    status: searchStatus
  } = await useAsyncData(`rearchBook:${searchText.value}`,
    async () => {
      const result = await searchFromGoogleBook({
        search: searchText.value,
        startIndex: pageOption.value.startIndex,
        maxResults: pageOption.value.prePageCount
      })
      return result
    },
    {
      immediate: false
    })
  
  const search = async () => {
    if (pageOption.value.totalCount && !hasNextPage) {
      $q.notify({
        type: 'negative',
        message: '無更多搜尋結果'
      })
      return
    }
    await searchRefresh()
    const books = getBookListFromResult(searchResult.value?.items)

    pageOption.value.totalCount = searchResult.value?.totalItems
    bookList.value.push(...books)
  }
  const searchLoading = computed(() => {
    return searchStatus.value === 'pending'
  })

  const noSearchResult = computed(() => {
    return searchStatus.value === 'success' && searchResult.value.length === 0
  })

  const clickSearch = async () => {
    const validation = await searchInputRef.value.validate()
    if (!validation) {
      // TODO: 搜尋無結果
      return
    }
    bookList.value.length = 0
    search()
  }
  const nextPage = () => {
    if (!hasNextPage) return
    pageOption.value.startIndex += pageOption.value.prePageCount
    search()
  }

  const save = async () => {
    const selectedBooks = selection.value.map(selectedId => {
      const currentBook = bookList.value.find(book => book.id === selectedId)
      return currentBook
    })

    const selectedBooksIds = selectedBooks.map(book => book.id)
    const { data: addBooksResult } = await useAsyncData(`addBook:[${selectedBooksIds.join(', ')}]`,
      async () => {
        const result = await addBooks(selectedBooks)
        return result
      })

    const firebaseUser = useFirebaseUser()
    const userDetailCookie = useCookie('userDetailCookie')

    const { data } = await useAsyncData(`addUserReadBooks:${firebaseUser.value.uid}:${selectedBooksIds.join(', ')}`, async () => {
      const result = await addUserReadBooks(firebaseUser.value.uid, selectedBooks, userDetailCookie.value)
      return result
    })

    dialogOpen.value = false
    clearSearch()
    emit('submit')
  }

</script>

<template>
  <q-dialog
    v-model="dialogOpen"
    :full-width="$q.screen.lt.md"
    :full-height="$q.screen.lt.md"
    >
    <q-card
      class=" flex flex-col w-full h-full text-white md:w-[70vw] md:!max-w-screen-md"
      >
      <q-card-section class="flex-none">
        <q-input
          ref="searchInputRef"
          v-model="searchText"
          @keypress.enter="clickSearch"
          type="search"
          autofocus
          outlined
          placeholder="請輸入搜尋文字（書名、作者、ISBN）"
          lazy-rules="ondemand"
          :rules="[
            val => val && val.length > 0 || '請輸入搜尋文字',
          ]"
          class=" pb-0">
          <template v-slot:append>
            <q-btn
              @click="clickSearch"
              round
              dense
              flat
              icon="search"
              />
          </template>
        </q-input>
      </q-card-section>

      <q-card-section
        class="flex-1 py-1 px-0 scroll h-full md:h-[50vh] bg-gray-100 !shadow-inner "
        >
        <div class="md:px-2">
          <BookItem
            v-for="book in bookList"
            :key="book.id"
            v-bind="book"
            v-model="selection"
            />
        </div>
        <div
          v-show="noSearchResult"
          class=" flex flex-col items-center justify-center h-full text-gray-500 font-bold ">
          <q-icon
            name="las la-search"
            size="3rem"
            />
          無更多搜尋結果
        </div>
        <div
          v-show="searchLoading"
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
        <div class=" px-2 mt-2">
          <q-btn
            v-if="pageOption.totalCount"
            :disable="!hasNextPage"
            class=" flex-none w-full"
            label="更多結果"
            color="primary"
            outline
            @click="nextPage"
            />
        </div>
      </q-card-section>

      <q-card-actions
        align="center"
        class="flex-none bg-white text-teal"
        >
        <q-btn
          @click="save"
          class=" w-full"
          label="儲存"
          color="primary"
          />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>