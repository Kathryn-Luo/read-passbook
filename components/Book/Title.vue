<script setup>
  const {
    title
  } = defineProps({
    title: String
  })
</script>

<template>
  <h3 class="mb-2 px-2 flex justify-between items-center text-lg bg-cyan-600/[.8] text-white rounded">
    <span>{{ title }}</span>
  </h3>
</template>