<script setup lang="ts">
import {
  date,
} from 'quasar'
const { formatDate } = date

const {
  book,
  canControl,
  showUser
} = defineProps({
  book: {
    type: Object as PropType<ReadRecord>,
    required: true
  },
  canControl: {
    type: Boolean,
    required: false
  },
  showUser: {
    type: Boolean,
    required: false,
  }
})

const emit = defineEmits([
  'toggleStatus',
  'editRecord',
  'deleteBook'
])

const getDateFormat = (date: Date, dateFormat: string = 'MM/DD') => {
  if (!date) return ''
  const newDateTime = date
  if (newDateTime.getFullYear() !== new Date().getFullYear()) {
    // 不同年份再顯示年
    dateFormat = `${newDateTime.getFullYear()}/${dateFormat}`
  }
  const newDate = formatDate(newDateTime, dateFormat)
  return newDate
}

const isDone = (book: ReadRecord): Boolean => {
  return Boolean(book.endDateTime)
}

</script>

<template>
  <div class="group/book-item rounded p-2 mb-3 transition duration-300  border border-dobule border-zinc-200 bg-zinc-200/70 shadow shadow-zinc-300 hover:bg-zinc-300">
    <div class=" flex group/book">
      <NuxtLink
        v-if="book.imageLinks?.smallThumbnail"
        :to="{
          name: 'book-bookId',
          params: {
            bookId: book.bookId
          }
        }"
        class=" flex-none mr-2 border border-zinc-200"
        >
        <NuxtImg
          :src="urlHttpToHttps(book.imageLinks.smallThumbnail) || urlHttpToHttps(book.imageLinks.thumbnail)"
          fit="contain"
          height="80"
          loading="lazy"
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
          class="mb-1 text-base leading-5 line-clamp-2 font-bold transition duration-300 hover:underline hover:text-cyan-700">
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
        class="pl-2 flex-none">
        <div
          v-if="canControl"
          class="mb-1">
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
        <p
          v-if="!showUser"
          class="flex items-center justify-end text-gray-400 cursor-default">
          <q-icon name="event"/>
          <span
            :title="`${getDateFormat(book.startDateTime, 'YYYY年MM月DD日')}${book.endDateTime ? '~' + getDateFormat(book.endDateTime, 'YYYY年MM月DD日') : ''}`">
            {{ getDateFormat(book.startDateTime) }}{{ book.endDateTime ? `~${getDateFormat(book.endDateTime)}` : '' }}
          </span>
        </p>
      </div>
    </div>
    <div
      v-if="(showUser && book.userDetail?.nickName) || !!book.note "
      class=" relative px-2 py-1 mt-2 justify-end items-end rounded-lg  text-zinc-600 text-sm border border-white bg-white transition duration-300 group-hover/book-item:bg-zinc-100"
      >
      <div
        v-if="book.note"
        v-dompurify-html="book.note"
        class=" max-h-[120px] overflow-y-auto pb-[40px] ">
      </div>
      <div
        v-if="showUser"
        :class="`${book.note ? 'absolute right-2 bottom-1' : ''}`"
        >
        <div
          v-if="book.userDetail && book.userDetail.nickName"
          class="group/user"
          >
          <nuxt-link
            :to="{
              name: 'user-account',
              params: { account: book.userDetail.account }
            }"
            class="flex items-end justify-end"
            >
            <p class=" text-right text-xs opacity-50">
              <span
                :title="`${getDateFormat(book.startDateTime, 'YYYY年MM月DD日')}${book.endDateTime ? '~' + getDateFormat(book.endDateTime, 'YYYY年MM月DD日') : ''}`"
                class="flex items-center justify-end opacity-60 cursor-default"
                >
                {{ getDateFormat(book.startDateTime) }}{{ book.endDateTime ? `~${getDateFormat(book.endDateTime)}` : '' }}
              </span>
              <span class="text-bold group-hover/user:underline group-hover/user:text-cyan-700">
                {{ book.userDetail.nickName }}
              </span>
              {{ book.endDateTime ? '已閱讀' : '正在閱讀' }}
            </p>
            <AccountAvatar
              v-if="book.userDetail.image"
              :image-url="book.userDetail.image"
              size="35"
              class="ml-1"
              border="2"
              />
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>