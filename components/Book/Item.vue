<script setup>
defineProps({
  id: String,
  title: String,
  imageLinks: Object,
  authors: Array,
  publisher: String,
  publishedDate: String
})
const selection = defineModel()


</script>

<template>
  <div class="flex">
    <div
      :style="{
        height: 100,
        width: 100
      }"
      class=" flex-none"
      >
      <NuxtImg
        v-if="imageLinks?.smallThumbnail"
        :src="imageLinks?.smallThumbnail"
        fit="contain"
        />
    </div>
    <div class="flex-1">
      <p class=" text-black text-sm">{{ title }}</p>
      <p v-if="authors?.length">作者：{{ authors.join(', ') }}</p>
      <p v-if="publisher">出版社：{{ publisher }}</p>
      <p v-if="publishedDate">出版日期：{{ publishedDate }}</p>
    </div>
    <div class="flex-none">
      <q-checkbox v-model="selection" :val="id" color="teal" />
    </div>
  </div>
</template>
