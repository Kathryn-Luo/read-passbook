<script setup>
  const appConfig = useAppConfig()
</script>


<template>
  <footer class=" bg-cyan-700/[0.3] py-3">
    <div class="container mx-auto">
      <p class=" text-center text-white">
        version: {{ appConfig.version }}
      </p>
    </div>
  </footer>
</template>