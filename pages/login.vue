<script lang="ts" setup>
import { useQuasar } from 'quasar'

const router = useRouter()
const $q = useQuasar()

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
    setTimeout(() => {
      router.replace('/')
    }, 800)
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '登入失敗'
    })
  } finally {
    $q.loading.hide()
  }
}

const register = async () => {
  try {
    await createUser(registerForm.value.email, registerForm.value.password)
    await signInUser(registerForm.value.email, registerForm.value.password)
    $q.notify({
      type: 'positive',
      message: '註冊成功'
    })
    setTimeout(() => {
      router.replace('/')
    }, 800)
   
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: '註冊失敗'
    })
  } finally {
    $q.loading.hide()
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
          />
      </q-tab-panel>
      <q-tab-panel name="register">
        <LoginRegisterPanel
          :form="registerForm"
          @register="register"
          />
      </q-tab-panel>
    </q-tab-panels>
</template>
