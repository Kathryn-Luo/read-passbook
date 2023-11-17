<script setup>
useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} - 閱讀存摺 Read PassBook` : '閱讀存摺 Read PassBook';
  }
})

useSeoMeta({
  // title: '閱讀存摺 Read PassBook',
  ogTitle: '閱讀存摺 Read PassBook',
  description: 'This is my amazing site, let me tell you all about it.',
  ogDescription: 'This is my amazing site, let me tell you all about it.',
  ogImage: 'https://example.com/image.png',
  twitterCard: 'summary_large_image',
})
</script>

<template>
  <div>
    <q-layout class=" bg-stone-100">
      <TheHeader />
      <q-page-container>
        <q-page padding class="container mx-auto w-3/5 px-8 bg-white">
          <NuxtPage />
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>
