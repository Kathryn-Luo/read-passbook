<script setup>
definePageMeta({
  middleware: ['auth'],
})
const config = useRuntimeConfig()
const submitLoading = ref(false)
const $q = useQuasar()
const fileInput = ref(null)
const imageSize = reactive(150)

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
  lazy: true,
  server: false
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
const setUserImage = (imageUrl) => {
  userInfo.value.image = imageUrl
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

const getFixedImageUrl = (imageUrl) => {
  // 為了修正 Nuxt/image 加上 domains 後產生的問題
  // TODO: 確認後續版本是否修正，並跟著調整
  if (imageUrl && imageUrl.indexOf('http') === -1) return imageUrl
  const splicedImgUrl = imageUrl.replace('https://firebasestorage.googleapis.com/v0/b/read-passbook.appspot.com/o/', '')
  const encodedImagePath = encodeURIComponent(splicedImgUrl)
  const fixedUrl = 'https://firebasestorage.googleapis.com/v0/b/read-passbook.appspot.com/o/' + encodedImagePath
  return fixedUrl
}

const clickFileButton = () => {
  fileInput.value.click()
}

</script>

<template>
  <div class="text-center mb-5 ">
    <div class=" inline-block relative">
      <div
        :style="{
          height: `${imageSize}px`,
          width: `${imageSize}px`,
        }"
        class="inline-block shadow-lg border-4 border-solid border-cyan-700 rounded-full bg-slate-300 overflow-hidden"
        >
        <NuxtImg
          v-if="userInfo?.image"
          :src="getFixedImageUrl(userInfo?.image)"
          fit="cover"
          :height="imageSize"
          :width="imageSize"
        />
      </div>
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
      <!-- <ProfileField
        v-model="userInfo.account"
        label="帳號"
        /> -->
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
        :append-icon="firebaseUser?.emailVerified ? 'las la-check' : null"
        :after-button="firebaseUser?.emailVerified ? null : verifiedEmailText"
        :after-button-disabled="emailIsSending"
        @clickAfter="goVerifiedEmail"
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