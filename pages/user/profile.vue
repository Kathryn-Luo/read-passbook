<script setup>
definePageMeta({
  middleware: ['auth'],
})
defineRouteRules({
  ssr: false
})
const config = useRuntimeConfig()
const submitLoading = ref(false)
const $q = useQuasar()
const fileInput = ref(null)

const firebaseUser = await getUserDetailWaitFirebaseLoaded() // 取得最新 userData
saveUserInLocal(firebaseUser) // 更新最新 user 資料

const firebaseUserDetail = useFirebaseUserDetail()
const userDetail = ref(config.public.defaultUserDetail)
if (firebaseUserDetail.value) {
  userDetail.value = {
    ...firebaseUserDetail.value
  }
}
watch(firebaseUserDetail, (newUserDetail) => {
  if (newUserDetail) {
    userDetail.value = {
      ...userDetail.value,
      ...newUserDetail
    }
  }
})

const emailIsSending = ref(null)
const verifiedEmailText = ref('點擊驗證')
const goVerifiedEmail = async () => {
  if (emailIsSending.value) return
  try {
    emailIsSending.value = true
    verifiedEmailText.value = '(發送中)'
    await verifiedAuthEmail()
    $q.notify({
      type: 'positive',
      message: '驗證信件已發送至 Email，請至電子信箱收取信件以驗證',
      timeout: 10 * 1000
    })
    setTimeout(() => {
      emailIsSending.value = false
      verifiedEmailText.value = '點擊驗證'
    }, 30 * 1000)
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    let notifyMessage = '驗證信件發送失敗'
    if (notifyMessage === 'TOO_MANY_ATTEMPTS_TRY_LATER') {
      notifyMessage = '請稍後再發送驗證信件'
    } else {
      emailIsSending.value = false
      verifiedEmailText.value = '點擊驗證'
    }
    $q.notify({
      type: 'negative',
      message: notifyMessage
    })
  }
}
const submit = async () => {
  try {
    submitLoading.value = true
    await updateUser({
      uid: firebaseUser.value.uid,
      account: userDetail.value.account,
      nickName: userDetail.value.nickName,
      profile: userDetail.value.profile
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
const setUserImage = (imageUrl) => {
  userDetail.value.image = imageUrl
}
const uploadImage = async (event) => {
  const file = event.target.files?.[0]
  if (!file) return

  // 上傳前縮圖 => fit=cover 無法處理
  // const reader  = new FileReader()
  // reader.onloadend = function () {
  //   setUserImage(reader.result)
  // }
  // reader.readAsDataURL(file)

  try {
    const result = await uploadUserImage(file)
    setUserImage(result)
  } catch (error) {
    console.log('error', error)
  }
}

const clickFileButton = () => {
  fileInput.value.click()
}

</script>

<template>
  <div class="text-center mb-5 ">
    <div class=" mt-3 inline-block relative">
      <AccountAvatar :imageUrl="userDetail.image" />
      <div
        class=" cursor-pointer absolute bottom-0 right-0"
        >
        <q-btn
          round
          color="primary"
          icon="las la-camera"
          @click="clickFileButton"
          />
        <input
          ref="fileInput"
          class=" hidden"
          type="file"
          accept="image/*"
          @change="uploadImage"
          />
      </div>
    </div>
  </div>

  <div>
    <q-form
      @submit="submit"
      ref="formRef"
      class=" px-6 table w-full"
      >
      <!-- <ProfileField
        v-model="userInfo.account"
        label="帳號"
        /> -->
      <ProfileField
        v-model="userDetail.nickName"
        label="暱稱"
        placeholder="請輸入暱稱"
        @submit="submit"
        />
      <ProfileField
        v-model="userDetail.email"
        label="Email"
        placeholder="請輸入Email"
        disabled
        type="email"
        :append-icon="firebaseUser?.emailVerified ? 'las la-check' : null"
        :after-button="firebaseUser?.emailVerified ? null : verifiedEmailText"
        :after-button-disabled="emailIsSending"
        @clickAfter="goVerifiedEmail"
        />
      <!-- <ProfileField
        v-model="userDetail.facebook"
        label="Facebook 帳號"
        placeholder="請輸入 Facebook 帳號"
        /> -->
      <!-- <ProfileField
        v-model="userDetail.instagram"
        label="Instagram 帳號"
        placeholder="請輸入 Instagram 帳號"
        /> -->
      <ProfileField
        v-model="userDetail.profile"
        label="個人簡介"
        placeholder="請輸入個人簡介"
        type="textarea"
        />
    </q-form>
    <q-btn
      :loading="submitLoading"
      color="primary"
      class=" w-full mt-3"
      @click="submit"
      >
      儲存
    </q-btn>
  </div>

</template>