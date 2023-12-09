<script setup>
const {
  imageUrl = '',
  size,
  border
} = defineProps({
  imageUrl: String,
  size: Number | String,
  border: Number | String
})
const config = useRuntimeConfig()

let imageSize = reactive(size ? size : 80)
const imageIsFromGoogleBook = imageUrl.indexOf(config.public.googleBookImagePrefixUrl) > -1
const image = imageIsFromGoogleBook
  ? getFixedImageUrlFromGoogleBookApi(imageUrl)
  : imageUrl
</script>

<template>
<div
  :style="{
    height: size,
    width: size,
    borderWidth: `${border || 1}px`
  }"
  class=" flex-none border-solid border-cyan-700/[.6] rounded-sm"
  >
  <NuxtImg
    v-if="image"
    :src="image"
    fit="contain"
    :height="imageSize"
    :width="imageSize"
    background="white"
    />
</div>
</template>