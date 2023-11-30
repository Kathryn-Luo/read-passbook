<script setup>
const {
  imageUrl,
  size
} = defineProps({
  imageUrl: String,
  size: Number
})


let imageSize = reactive(size ? size : 150)
</script>

<template>
  <div
    :style="{
      height: `${imageSize}px`,
      width: `${imageSize}px`,
    }"
    class="inline-block shadow-lg border-4 border-solid border-cyan-700 rounded-full bg-slate-300 overflow-hidden"
    >
    <NuxtImg
      v-if="imageUrl"
      :src="getFixedImageUrlFromFirestore(imageUrl)"
      fit="cover"
      :height="imageSize"
      :width="imageSize"
    />
  </div>
</template>