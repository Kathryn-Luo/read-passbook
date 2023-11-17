<script setup>
const route = useRoute()
console.log('[ID] ID', route.params.ID)
console.log('[ID] route', route)
</script>

<template>
  This Page is BOOK {{ route.params.ID }}
</template>