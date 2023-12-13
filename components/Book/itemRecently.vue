<script setup>
const {
  book
} =  defineProps({
  book: Object
})
</script>

<template>
  <div
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
          :src="urlHttpToHttps(book.imageLinks.smallThumbnail) || urlHttpToHttps(book.imageLinks.thumbnail)"
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
      v-if="book.userDetail && book.userDetail.nickName"
      class="group/user mt-2 border-t border-double "
      >
      <nuxt-link
        :to="{
          name: 'user-account',
          params: { account: book.userDetail.account }
        }"
        class=" flex items-end justify-end py-1"
        >
        <p class=" mr-1">
          <span class="mr-1 font-bold group-hover/user:underline group-hover/user:text-cyan-700">
            {{ book.userDetail.nickName }}
          </span>
          正在閱讀
        </p>
        <AccountAvatar
          v-if="book.userDetail.image"
          :image-url="book.userDetail.image"
          size="50"
          border="3"
          />
      </nuxt-link>
    </div>
  </div>
</template>