<script setup>
  const {
    title
  } = defineProps({
    title: String
  })
</script>

<template>
  <h3 class="mb-2 px-2 text-lg bg-cyan-600/[.8] text-white rounded">{{ title }}</h3>
</template>