<script setup>
import {
  date,
  useQuasar
} from 'quasar'
const { formatDate } = date
const $q = useQuasar()
const {
  title,
  bookList,
} = defineProps({
  title: String,
  bookList: Array,
})
const emit = defineEmits([
  'toggleStatus',
  'deleteBook'
])

const getDateFormat = (timestamp) => {
  if (!timestamp) return ''
  const newDateTime = timestamp.toDate()
  let dateFormat = 'MM/DD'
  if (newDateTime.getFullYear() !== new Date().getFullYear()) {
    // 不同年份再顯示年
    dateFormat = `${newDateTime.getFullYear()}/${dateFormat}`
  }
  const newDate = formatDate(newDateTime, dateFormat)
  return newDate
}
const isDone = (book) => {
  return book.endDateTime
}
const toggleStatus = (book) => {
  emit('toggleStatus', book)
}
const deleteBook = (book) => {
  $q.dialog({
    title: '刪除閱讀紀錄',
    message: `是否刪除「<span class="text-amber-700 font-bold">${book.title}</span>」此本書籍的閱讀紀錄？`,
    html: true,
    ok: {
      label: '刪除',
      color: 'negative',
    },
    cancel: {
      label: '取消',
      flat: true
    }
  }).onOk(() => {
    emit('deleteBook', book)
  })
}
</script>

<template>
  <div
    class="bg-stone-100 pb-4 rounded"
    >
    <BookTitle
      v-if="title"
      :title="title">
      <template #innerAppred>
        <slot name="innerAppred"></slot>
      </template>
    </BookTitle>
    <li
      v-for="book in bookList"
      :key="book.id"
      class="py-3 list-none px-3 flex items-center"
      >
      <q-icon name="las la-book" class="flex-none pr-2" />
      <nuxt-link
        :to="{ name: 'book-bookId', params: { bookId: book.bookId } }"
        class=" text-base text-cyan-900 leading-5 flex-1 hover:underline"
        >
        {{ book.title }}
      </nuxt-link>
      <span
        class=" flex-none ml-2">
        {{ getDateFormat(book.startDateTime) }}
      </span>
      <div class=" pl-2">
        <q-btn
          @click="() => toggleStatus(book)"
          :icon="`las ${isDone(book) ? 'la-undo' : 'la-check-circle'}`"
          outline
          round
          size="sm"
          color="primary"
          />
        <q-btn
          @click="() => deleteBook(book)"
          icon="las la-trash-alt"
          round
          size="sm"
          unelevated
          color="negative"
          class=" ml-1"
          />
        </div>
    </li>
  </div>
</template>