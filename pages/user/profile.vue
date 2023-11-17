<script setup>
definePageMeta({
  middleware: ['auth'],
})
const config = useRuntimeConfig()
const submitLoading = ref(false)
const $q = useQuasar()

const firebaseUser = useFirebaseUser()
const firebaseUserDetail = useFirebaseUserDetail()
const firebaseUserDetailRef = ref(firebaseUserDetail)
const userInfo = ref(config.public.defaultUserDetail)

const { pending } = await useAsyncData('myUserDetail', async () => {
  if (firebaseUserDetailRef.value) {
    userInfo.value = JSON.parse(JSON.stringify(firebaseUserDetailRef.value))
    return firebaseUserDetailRef.value
  }

  try {
    const firebaseUserData = await getUserDetailWaitFirebaseLoaded()
    const userDetail = await getUserByUid(firebaseUserData?.uid)
    saveUserDetailInCookie(userDetail)
    userInfo.value = JSON.parse(JSON.stringify(userDetail))

    return userDetail
  } catch (error) {
    console.log(error)
  }
}, {
  lazy: true
})


const submit = async () => {
  try {
    submitLoading.value = true
    await updateUser({
      uid: firebaseUser.value.uid,
      account: userInfo.value.account,
      nickName: userInfo.value.nickName
    })
    $q.notify({
      type: 'positive',
      message: '儲存成功'
    })
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '儲存失敗'
    })
    console.log('error', error)
  } finally {
    submitLoading.value = false
  }
}

</script>

<template>
  <div class="text-center">
    <div
      class=" inline-block h-[150px] w-[150px] shadow-lg border-4 border-solid border-cyan-700 rounded-full bg-slate-300 overflow-hidden">
      <NuxtImg
        v-if="userInfo?.image"
        :src="userInfo?.image"
        width="150"
        height="150"
      />
    </div>
  </div>

  <div v-if="pending"
    class=" w-full flex justify-center py-20">
    <q-circular-progress
      indeterminate
      rounded
      size="50px"
      color="light-blue"
      class="q-ma-md"
    />
  </div>
  <div v-else>
    <q-form
      @submit="submit"
      ref="formRef"
      class=" px-6 table w-full"
      >
      <ProfileField
        v-model="userInfo.account"
        label="帳號"
        />
      <ProfileField
        v-model="userInfo.nickName"
        label="暱稱"
        placeholder="請輸入暱稱"
        @submit="submit"
        />
      <ProfileField
        v-model="userInfo.email"
        label="Email"
        placeholder="請輸入Email"
        disabled
        />
      <ProfileField
        v-model="userInfo.facebook"
        label="Facebook 帳號"
        placeholder="請輸入 Facebook 帳號"
        />
      <ProfileField
        v-model="userInfo.instagram"
        label="Instagram 帳號"
        placeholder="請輸入 Instagram 帳號"
        />
      <q-btn
        :loading="submitLoading"
        type="submit">
        儲存
      </q-btn>
    </q-form>
  </div>

</template>