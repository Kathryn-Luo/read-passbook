<script setup>
const router = useRouter()

getGoogleLoginUser()
  .then(user => {
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