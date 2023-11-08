<script setup>
  const props = defineProps({
    form: Object,
    title: String,
    message: String
  })
  const emit = defineEmits(['submit'])

  const isPwd = ref(true)

  const formRef = ref(null)

  const submit = async () => {
    const form = ref(props.form)
    const validation = await formRef.value.validate()
    if (validation) {
      emit('submit', form)
    }
  }
</script>

<template>
  <div>
    <h2>{{ title }}</h2>
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
        label="送出"
        @click="submit"
        class=" w-full mt-8"
        />
    </q-form>

    <p v-if="message">{{ message }}</p>
  </div>
</template>