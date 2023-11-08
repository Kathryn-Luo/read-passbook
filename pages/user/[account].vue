<script setup>
const route = useRoute()
console.log(route.params.ISBN)
console.log(route)
</script>

<template>
  This Page is BOOK {{ route.params.account }}
</template>