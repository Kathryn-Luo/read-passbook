<script setup>
import { useQuasar } from 'quasar'
const router = useRouter()
const $q = useQuasar()

const useGoogleLoginCookie = useCookie('useGoogleLogin', {maxAge: 30})
const clickGoogleLogin = () => {
  useGoogleLoginCookie.value = true
  loginWithGoogle()
}
if (useGoogleLoginCookie.value) {
  $q.loading.show()
}
const firebaseUser = useFirebaseUser()
const firebaseUserDetail = useFirebaseUserDetail()
watch(firebaseUserDetail, async (user) => {
  if (!user || Object.keys(user).length === 0) {
    // 首次以 Google 登入
    const userDetail = {
      uid: firebaseUser.value.uid,
      email: firebaseUser.value.email,
      account: firebaseUser.value.uid,
      nickName: firebaseUser.value.displayName,
      image: firebaseUser.value.photoURL
    }
    await $fetch(`/api/user/detail/${firebaseUser.value.uid}`, {
      method: 'POST',
      body: userDetail
    })
    saveUserDetailInCookie(userDetail)
  }
  $q.loading.hide()
  useGoogleLoginCookie.value = null
  router.replace('/')
})
</script>


<template>
  <q-btn
    color="primary"
    label="Google登入"
    @click="clickGoogleLogin"
    outline
    />
</template>