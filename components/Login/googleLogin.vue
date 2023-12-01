<script setup>
const router = useRouter()

onMounted(async() => {
  const user = await getGoogleLoginUser()
  if (user) {
    router.replace('/')
  }
})
</script>


<template>
  <q-btn
    color="primary"
    label="Google登入"
    @click="loginWithGoogle"
    />
</template>