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
  canControl
} = defineProps({
  title: String,
  bookList: Array,
  canControl: Boolean
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
  if (!canControl) return
  emit('toggleStatus', book)
}
const deleteBook = (book) => {
  if (!canControl) return
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
  <div>
    <BookTitle
      v-if="title"
      :title="title">
      <template #innerAppred>
        <slot name="innerAppred"></slot>
      </template>
    </BookTitle>
    <Book
      v-for="book in bookList"
      :key="book.id"
      :book="book"
      :canControl="canControl"
      @toggleStatus="toggleStatus"
      @deleteBook="deleteBook"
      />
  </div>
</template>