<script setup>
defineProps({
  id: String,
  volumeInfo: Object
})
const selection = defineModel()


</script>

<template>
  <div class="flex py-2 border-b last:border-none border-dashed border-cyan-600">
    <div
      class=" flex-none"
      >
      <BookItemImage
        :imageUrl="volumeInfo?.imageLinks?.smallThumbnail"
        size="80"
        />
    </div>
    <div class="flex-1 pl-2 text-black text-xs">
      <p class=" font-bold text-sm">{{ volumeInfo?.title }}</p>
      <p v-if="volumeInfo?.authors?.length">作者：{{ volumeInfo?.authors.join(', ') }}</p>
      <p v-if="volumeInfo?.publisher">出版社：{{ volumeInfo?.publisher }}</p>
      <p v-if="volumeInfo?.publishedDate">出版日期：{{ volumeInfo?.publishedDate }}</p>
    </div>
    <div class="flex-none">
      <q-checkbox v-model="selection" :val="id" color="teal" />
    </div>
  </div>
</template>
