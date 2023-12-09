<script setup>
const props = defineProps({
  id: String,
  volumeInfo: Object
})
const {
  id,
  volumeInfo
} = props
const selection = defineModel()
const isSelected = computed(() => {
  return selection.value.includes(id)
})
</script>

<template>
  <label
    :class="`${isSelected ? 'bg-stone-200' : ''} flex p-2 border-b last:border-none border-dashed border-cyan-600 transition`"
    >
    <div
      class=" flex-none"
      >
      <NuxtLink
        :to="{
          name: 'book-bookId',
          params: {
            bookId: id
          }
        }"
        target="_blank"
        >
        <BookItemImage
          :imageUrl="volumeInfo?.imageLinks?.smallThumbnail"
          size="80"
          />
      </NuxtLink>
    </div>
    <div class="flex-1 pl-2 text-black text-xs">
      <nuxt-link
        :to="{
          name: 'book-bookId',
          params: {
            bookId: id
          }
        }"
        target="_blank"
        class=" font-bold text-sm text-cyan-700 underline">
        {{ volumeInfo?.title }}
      </nuxt-link>
      <p class=" font-bold text-sm"></p>
      <p v-if="volumeInfo?.authors?.length">作者：{{ volumeInfo?.authors.join(', ') }}</p>
      <p v-if="volumeInfo?.publisher">出版社：{{ volumeInfo?.publisher }}</p>
      <p v-if="volumeInfo?.publishedDate">出版日期：{{ volumeInfo?.publishedDate }}</p>
    </div>
    <div class="flex-none">
      <q-checkbox v-model="selection" :val="id" color="teal" />
    </div>
  </label>
</template>
