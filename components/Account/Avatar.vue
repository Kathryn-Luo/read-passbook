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

let imageSize = reactive(size ? size : 150)
const imageIsFromFirestorge = imageUrl.indexOf(config.public.firestoreImagePrefixUrl) > -1
const image = imageIsFromFirestorge
  ? getFixedImageUrlFromFirestore(imageUrl)
  : imageUrl
</script>

<template>
  <div
    :style="{
      height: `${imageSize}px`,
      width: `${imageSize}px`,
      borderWidth: `${border || 4}px`
    }"
    class="inline-block shadow-lg border-solid border-cyan-700 rounded-full bg-slate-300 overflow-hidden"
    >
    <NuxtImg
      v-if="imageUrl"
      :src="image"
      fit="cover"
      :height="imageSize"
      :width="imageSize"
    />
  </div>
</template>