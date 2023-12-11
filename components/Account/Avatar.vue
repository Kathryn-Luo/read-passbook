<script setup>
const props = defineProps({
  imageUrl: String,
  size: Number | String,
  border: Number | String
})
const config = useRuntimeConfig()

let imageSize = reactive(props.size ? props.size : 150)
const imageIsFromFirestorge = (imageUrl) => {
  return imageUrl.indexOf(config.public.firestoreImagePrefixUrl) > -1
}
const image = computed(() => {
  return imageIsFromFirestorge(props.imageUrl)
  ? getFixedImageUrlFromFirestore(props.imageUrl)
  : props.imageUrl
})
</script>

<template>
  <div
    :style="{
      height: `${imageSize}px`,
      width: `${imageSize}px`,
      borderWidth: `${props.border || 4}px`
    }"
    class="inline-block shadow-lg border-solid border-cyan-700 rounded-full bg-slate-300 overflow-hidden"
    >
    <NuxtImg
      v-if="image"
      :src="image"
      fit="cover"
      :height="imageSize"
      :width="imageSize"
    />
  </div>
</template>