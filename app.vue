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
    <q-layout class=" bg-stone-100 min-h-full">
      <TheHeader />
      <q-page-container>
        <q-page padding class="container mx-auto md:w-3/5 bg-white">
          <NuxtPage />
        </q-page>
      </q-page-container>
      <TheFooter />
    </q-layout>
  </div>
</template>
