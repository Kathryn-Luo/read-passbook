<script setup>
const props = defineProps({
  form: Object,
})
const emit = defineEmits([
  'signin',
  'forgetPassword'
])

const forgetPasswordOpen = ref(false)
const forgetPasswordEmail = ref(null)

const isPwd = ref(true)

const formRef = ref(null)

const submit = async () => {
  const form = ref(props.form)
  const validation = await formRef.value.validate()
  if (validation) {
    emit('signin', form)
  }
}
const forgetPassword = async => {
  forgetPasswordOpen.value = true
}

const forgetPasswordSubmit = async () => {
  emit('forgetPassword', forgetPasswordEmail.value)
}
</script>

<template>
  <q-form
    @submit="submit"
    ref="formRef"
    >
    <q-input
      outlined
      v-model="form.email"
      label="Email"
      type="email"
      lazy-rules="ondemand"
      autofocus
      @keyup.enter="submit"
      :rules="[
        val => val && val.length > 0 || '請輸入 Email',
        (val, rules) => rules.email(val) || '請輸入正確格式'
      ]"
      />
    <q-input
      outlined
      v-model="form.password"
      label="密碼"
      :type="isPwd ? 'password' : 'text'"
      lazy-rules="ondemand"
      :rules="[
        val => val && val.length > 0 || '請輸入密碼',
      ]"
      @keyup.enter="submit"
      class="mt-5"
      >
      <template v-slot:append>
        <q-icon
          :name="isPwd ? 'visibility_off' : 'visibility'"
          class="cursor-pointer"
          @click="isPwd = !isPwd"
        />
      </template>
    </q-input>
    <q-btn
      label="登入"
      @click="submit"
      class=" w-full mt-8"
      />
  </q-form>
  <div class="text-center">
    <q-btn
      class="mt-5"
      flat
      color="primary"
      label="忘記密碼"
      @click="forgetPassword"
      />
  </div>
  <loginForgetPassword
    v-model="forgetPasswordOpen"
    v-model:email="forgetPasswordEmail"
    @submit="forgetPasswordSubmit"
    />
</template>