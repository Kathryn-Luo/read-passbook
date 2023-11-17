<script setup>
  const dialogOpen = defineModel()
  const emit = defineEmits(['submit'])

  const searchText = ref(null)
  const searchInputRef = ref(null)
  const selection = ref([])
  
  const bookList = ref([])

  const getBookListFromResult = (result) => {
    return result.map(book => ({
      id: book.id,
      ...book.volumeInfo
    }))
  }
  const search = async () => {
    const validation = await searchInputRef.value.validate()
    if (!validation) {
      // TODO: 搜尋無結果
      return
    }
    const { data } = await useAsyncData(`rearchBook:${searchText.value}`, async () => {
      const result = await searchFromGoogleBook(searchText.value)
      return result
    })
    const books = getBookListFromResult(data.value?.items)

    bookList.value = books
  }

  const save = async () => {
    const selectedBooks = selection.value.map(selectedId => {
      const currentBook = bookList.value.find(book => book.id === selectedId)
      return currentBook
    })

    const selectedBooksIds = selectedBooks.map(book => book.id)
    const { data: addBooksResult } = await useAsyncData(`addBook:[${selectedBooksIds.join(', ')}]`,
      async () => {
        const result = await addBooks (books)
        return result
      })

    const firebaseUser = useFirebaseUser()
    const { data } = await useAsyncData(`addUserReadBooks:${firebaseUser.value.uid}:${selectedBooksIds.join(', ')}`, async () => {
      const result = await addUserReadBooks(firebaseUser.value.uid, selectedBooks)
      return result
    })

    dialogOpen.value = false
    emit('submit')
  }

</script>

<template>
  <q-dialog
    v-model="dialogOpen"
    >
    <q-card
      class=" text-white w-[70vw] !max-w-screen-md"
      >
      <q-card-section>
        <q-input
          ref="searchInputRef"
          v-model="searchText"
          @keypress.enter="search"
          autofocus
          outlined
          placeholder="請輸入搜尋文字（書名、作者、ISBN）"
          lazy-rules="ondemand"
          :rules="[
            val => val && val.length > 0 || '請輸入搜尋文字',
          ]">
          <template v-slot:append>
            <q-btn
              @click="search"
              round
              dense
              flat
              icon="search"
              />
          </template>
        </q-input>
      </q-card-section>

      <q-card-section
        class="scroll h-[50vh]"
        >
        <BookItem
          v-for="book in bookList"
          :key="book.id"
          v-bind="book"
          v-model="selection"
          />
      </q-card-section>

      <q-card-actions
        align="center"
        class="bg-white text-teal"
        >
        <q-btn
          @click="save"
          label="儲存"
          />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>