<script setup lang="ts">
interface ReadRecordProps {
  id: string
  bookId: string
  title: string
  startDateTime: Date
  endDateTime?: Date
  authors?: string[]
  publisher?: string
  imageLinks?: any
  updateBook?: Object
  userDetail?: object,
  note?: string,
  [propName: string]: any
}

const {
  book,
  canControl
} = defineProps({
  book: {
    type: Object as PropType<ReadRecordProps>,
    required: true
  },
  canControl: {
    type: Boolean,
    required: false
  }
})

const emit = defineEmits([
  'toggleStatus',
  'editRecord',
  'deleteBook'
])
const isDone = (book: ReadRecordProps): Boolean => {
  return Boolean(book.endDateTime)
}

</script>

<template>
  <div class="rounded p-2 mb-2 transition duration-300 bg-zinc-100 hover:bg-zinc-200">
    <div class=" flex group/book">
      <NuxtLink
        v-if="book.imageLinks?.smallThumbnail"
        :to="{
          name: 'book-bookId',
          params: {
            bookId: book.bookId
          }
        }"
        class=" flex-none mr-2"
        >
        <NuxtImg
          :src="urlHttpToHttps(book.imageLinks.smallThumbnail) || urlHttpToHttps(book.imageLinks.thumbnail)"
          fit="contain"
          height="80"
        />
      </NuxtLink>
      <div class=" flex-1">
        <NuxtLink
          :to="{
            name: 'book-bookId',
            params: {
              bookId: book.bookId
            }
          }"
          target="_blank"
          class=" text-base font-bold transition duration-300 hover:underline hover:text-cyan-700">
          {{ book.title }}
        </NuxtLink>
        <p
          v-if="book.authors?.length"
          class="text-sm"
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
      <div
        v-if="canControl"
        class="pl-2 flex-none">
        <q-btn
          @click="() => emit('toggleStatus', book)"
          :icon="`las ${isDone(book) ? 'la-undo' : 'la-check'}`"
          unelevated
          outline
          round
          size="sm"
          color="primary"
          >
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 5]">
            {{ isDone(book) ? '重新閱讀' : '閱讀完畢' }}
          </q-tooltip>
        </q-btn>
        <q-btn
          @click="() => emit('editRecord', book)"
          icon="las la-edit"
          outline
          round
          size="sm"
          class=" ml-2"
          >
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 5]">
            編輯
          </q-tooltip>
        </q-btn>
        <q-btn
          @click="() => emit('deleteBook', book)"
          icon="las la-trash-alt"
          round
          size="sm"
          outline
          color="negative"
          class=" ml-1">
          <q-tooltip anchor="top middle" self="bottom middle" :offset="[0, 5]">
            刪除
          </q-tooltip>
        </q-btn>
      </div>
    </div>
    <div
      v-if="book.note"
      class=" mt-2 rounded-lg px-2 py-1 text-zinc-600 text-sm border-4 border-double border-zinc-300 bg-white"
      >
      <div>
        {{book.note }}
      </div>
    </div>
  </div>
</template>