<script lang="ts" setup>
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

// 已登入會導向至首頁
// TODO: 如果 userCookie 資料錯誤？
definePageMeta({
  middleware: [
    function (to, from) {
      const userCookie = useCookie('userCookie')
      if (userCookie.value) {
        return navigateTo({
          path: '/',
        })
      }
    },
  ],
});

const tab = ref('login')

const signinForm = ref({ email: '', password: '' });
const registerForm = ref({
  email: '',
  password: '',
  confirmPassword: '',
});

const signin = async () => {
  $q.loading.show()
  try {
    await signInUser(signinForm.value.email, signinForm.value.password)
    signinForm.value = { email: '', password: '' }
    $q.notify({
      type: 'positive',
      message: '登入成功'
    })
    router.replace('/')
  } catch (error: any) {
    console.log(error)
    const errorCode = error.code;
    const notifyMessage = authErrorMessage(errorCode) || '登入失敗'
    $q.notify({
      type: 'negative',
      message: notifyMessage
    })
  } finally {
    $q.loading.hide()
  }
}

const register = async () => {
  try {
    await createUser(registerForm.value.email, registerForm.value.password)
    $q.notify({
      type: 'positive',
      message: '註冊成功，請至電子信箱驗證電子郵件',
      timeout: 30 * 1000
    })
    tab.value = 'login'
   
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorCode, errorMessage)
    const notifyMessage = authErrorMessage(errorCode) || '註冊失敗'
    $q.notify({
      type: 'negative',
      message: notifyMessage
    })
  } finally {
    $q.loading.hide()
  }
}

const forgetPassword = async (email: string) => {
  try {
    const result = await authForgetPassword(email)
    $q.notify({
      type: 'positive',
      message: '電子郵件發送成功，請至電子信箱查看',
      timeout: 30 * 1000
    })

  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    const notifyMessage = authErrorMessage(errorCode) || '發送失敗'
    $q.notify({
      type: 'negative',
      message: notifyMessage
    })
  }
}
</script>

<template>
    <q-tabs
      v-model="tab"
      class="text-teal"
    >
      <q-tab name="login" label="登入" />
      <q-tab name="register" label="註冊" />
    </q-tabs>


    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="login">
        <LoginPanel
          :form="signinForm"
          @signin="signin"
          @forgetPassword="forgetPassword"
          />
      </q-tab-panel>
      <q-tab-panel name="register">
        <LoginRegisterPanel
          :form="registerForm"
          @register="register"
          />
      </q-tab-panel>
    </q-tab-panels>
    <div class=" flex justify-center">
      <LoginGoogleLogin />
    </div>
</template>
