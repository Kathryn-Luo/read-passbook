<script setup>
 const {
  title,
  bookList,
 } = defineProps({
  title: String,
  bookList: Array,
 })
</script>

<template>
  <div
    v-if="bookList?.length"
    class="bg-stone-100 pb-4 rounded"
    >
    <BookTitle
      v-if="title"
      :title="title"
      />

    <li
      v-for="book in bookList"
      :key="book.id"
      class="py-3 list-none px-3 flex items-center"
      >
      <q-icon name="las la-book" class="flex-none pr-2" />
      <nuxt-link
        :to="{ name: 'book-ISBN', params: { ISBN: book.ISBN } }"
        class=" text-base text-cyan-900 leading-5 flex-1 hover:underline"
        >
        {{ book.name }}
      </nuxt-link>
      <span
        class=" flex-none ml-2">
        {{ book.date }}
      </span>
    </li>
  </div>
</template>