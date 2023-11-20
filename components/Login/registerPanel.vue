<script setup>
  const props = defineProps({
    form: Object,
  })
  const emit = defineEmits(['register'])

  const showPassword = ref(false)
  const showConfirmPassword = ref(false)
  const formRef = ref(null)
  const passwordRef = ref(null)
  const confirmPasswordRules = async (val) => {
    return val === props.form.password || '請確認密碼是否相符'
  }

  const submit = async () => {
    const form = ref(props.form)
    const validation = await formRef.value.validate()
    if (validation) {
      emit('register', form)
    }

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
      @keyup.enter="submit"
      :rules="[
        val => val && val.length > 0 || '請輸入 Email',
        (val, rules) => rules.email(val) || '請輸入正確格式'
      ]"
      />
    <q-input
      outlined
      v-model="form.password"
      ref="passwordRef"
      label="密碼"
      placeholder="請輸入密碼"
      :type="showPassword ? 'text' : 'password'"
      lazy-rules="ondemand"
      :rules="[
        val => val && val.length > 0 || '請輸入密碼',
      ]"
      @keyup.enter="submit"
      class="mt-5"
      >
      <template v-slot:append>
        <q-icon
          :name="showPassword ? 'visibility' : 'visibility_off'"
          class="cursor-pointer"
          @click="showPassword = !showPassword"
        />
      </template>
    </q-input>
    <q-input
      outlined
      v-model="form.confirmPassword"
      label="確認密碼"
      placeholder="請再次輸入密碼"
      :type="showConfirmPassword ? 'text' : 'password'"
      lazy-rules="ondemand"
      :rules="[
        val => val && val.length > 0 || '請再次輸入密碼',
        confirmPasswordRules
      ]"
      @keyup.enter="submit"
      class="mt-5"
      >
      <template v-slot:append>
        <q-icon
          :name="showConfirmPassword ? 'visibility': 'visibility_off'"
          class="cursor-pointer"
          @click="showConfirmPassword = !showConfirmPassword"
        />
      </template>
    </q-input>

    <q-btn
      label="註冊"
      @click="submit"
      class=" w-full mt-8"
      />
  </q-form>
</template>