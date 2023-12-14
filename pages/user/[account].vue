<script setup>
const nuxtApp = useNuxtApp()
const route = useRoute()
const account = route.params.account

const {
  data: userDetail,
  pending: userDetailPending,
} = await useAsyncData(`userDetail:${account}`, async () => {
  const currentUserDeatil = await getUserByAccount(account)
  currentUserDeatil.profileArray = getLinesTextFromTextarea(currentUserDeatil?.profile)
  return currentUserDeatil
})

useSeoMeta({
  title: () => `${userDetail.value?.nickName}的閱讀紀錄`,
  ogTitle: () => `${userDetail.value?.nickName}的閱讀紀錄`,
  // description: () => bookDetail.value?.volumeInfo.description,
  // ogDescription: () => bookDetail.value?.volumeInfo.description,
  ogImage: () => userDetail.value?.image || '',
})

const firebaseAuthUser = await getUserDetailWaitFirebaseLoaded()
const isAuthor = firebaseAuthUser && (userDetail?.value?.uid === firebaseAuthUser?.uid)

const { data: booksData, refresh: userReadBookRefresh } = await useAsyncData(`getUserReadBooks:${account}`, async () => {
  const result = await getUserReadBooks(userDetail?.value?.uid)
  const readingBooks = []
  const readDoneBooks = []
  result.forEach(book => {
    if (book.endDateTime) {
      readDoneBooks.push(book)
    } else {
      readingBooks.push(book)
    }
  })
  return {
    readingBooks,
    readDoneBooks
  }
}, {
  server: false,
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

const noRecord = computed(() => {
  return booksData.value?.readingBooks?.length + booksData.value?.readDoneBooks?.length === 0
})

const readDone = async (book) => {
  try {
    book.endDateTime = new Date()
    await updateUserReadBook(book.id, book)
    userReadBookRefresh()
  } catch (error) {
    console.log('readDone error', error)
  }
}
const undoReading = async (book) => {
  try {
    delete book.endDateTime
    await updateUserReadBook(book.id, book)
    userReadBookRefresh()
  } catch (error) {
    console.log('undoReading error', error)
  }
}
const deleteBook = async (book) => {
  try {
    await deleteUserReadBook(book.id)
    userReadBookRefresh()
  } catch (error) {
    console.log(error) 
  }
}

const dialogOpen = ref(false)
const createNewRecord = () => {
  dialogOpen.value = true
}
</script>

<template>
  <div>
    <div class="flex mb-4 md:w-3/5 mx-auto justify-center">
      <div v-if="userDetailPending"
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
      <div
        v-else
        class="md:flex"
        >
        <div
          class=" text-center"
          >
          <AccountAvatar
            :image-url="userDetail?.image"
            size="120"
            />
        </div>
        <div class=" text-center md:text-left md:pl-8 flex flex-col justify-around">
          <div>
            <h2
              class="text-2xl"
              >
              {{ userDetail?.nickName }}
            </h2>
          </div>
          <div class=" mt-2">
            <q-btn
              v-if="userDetail?.email"
              icon="mail_outline"
              :title="userDetail?.email"
              :href="`mailto: ${userDetail?.email}`"
              round
              size="sm"
              unelevated
              class="bg-amber-400 text-white mr-2"
              />
            <q-btn
              v-if="userDetail?.facebook"
              icon="lab la-facebook-f"
              round
              unelevated
              size="sm"
              class=" bg-[#3b5998] text-white mr-2"
              />
            <q-btn
              v-if="userDetail?.instagram"
              icon="lab la-instagram"
              round
              unelevated
              size="sm"
              class=" bg-[#3b5998] text-white"
              />
          </div>
          <p v-if="userDetail?.profile">
            <template v-for="text in userDetail?.profileArray">
              {{ text }}<br />
            </template>
          </p>
        </div>
      </div>
    </div>
    <ClientOnly>
      <q-btn
        v-if="isAuthor"
        label="新增閱讀紀錄"
        @click="createNewRecord"
        flat
        color="primary"
        class=" w-full my-5 border-2 border-dotted "
        />
    </ClientOnly>
    <div
      v-if="noRecord"
      class=" text-center py-10 text-gray-500"
      >
      目前尚未有任何閱讀紀錄
    </div>
    <BookBlock
      v-if="booksData?.readingBooks?.length"
      :bookList="booksData?.readingBooks || []"
      @toggleStatus="readDone"
      @deleteBook="deleteBook"
      title="閱讀中"
      :canControl="isAuthor"
      />
    <BookBlock
      v-if="booksData?.readDoneBooks?.length"
      :bookList="booksData?.readDoneBooks || []"
      @toggleStatus="undoReading"
      @deleteBook="deleteBook"
      title="閱讀紀錄"
      class=" mt-8"
      :canControl="isAuthor"
      />
    <AccountCreateDialog
      v-model="dialogOpen"
      @submit="() => userReadBookRefresh()"
      />
  </div>
</template>