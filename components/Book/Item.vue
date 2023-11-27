<script setup>
defineProps({
  id: String,
  volumeInfo: Object
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
        v-if="volumeInfo?.imageLinks?.smallThumbnail"
        :src="volumeInfo?.imageLinks?.smallThumbnail"
        fit="contain"
        />
    </div>
    <div class="flex-1">
      <p class=" text-black text-sm">{{ volumeInfo?.title }}</p>
      <p v-if="volumeInfo?.authors?.length">作者：{{ volumeInfo?.authors.join(', ') }}</p>
      <p v-if="volumeInfo?.publisher">出版社：{{ volumeInfo?.publisher }}</p>
      <p v-if="volumeInfo?.publishedDate">出版日期：{{ volumeInfo?.publishedDate }}</p>
    </div>
    <div class="flex-none">
      <q-checkbox v-model="selection" :val="id" color="teal" />
    </div>
  </div>
</template>
