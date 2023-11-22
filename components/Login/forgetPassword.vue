<script setup>
  const promptOpen = defineModel()
  const email = defineModel('email', { local: true })


  const emit = defineEmits([
    'submit',
  ])
  const emailRef = ref(null)

  const submit = async () => {
    const validation = await emailRef.value.validate()
    if (validation) {
      emit('submit')
    }
  }

  watch(promptOpen, (newVal) => {
    if (!newVal) {
      email.value = null
    }
  })

</script>

<template>
  <q-dialog
    v-model="promptOpen"
    >
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">忘記密碼</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <p>請輸入您註冊時的 email</p>
        <q-input
          ref="emailRef"
          v-model="email"
          @keypress.enter="submit"
          dense
          autofocus
          type="email"
          lazy-rules="ondemand"
          :rules="[
            val => val && val.length > 0 || '請輸入 Email',
            (val, rules) => rules.email(val) || '請輸入正確格式'
          ]"
          />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn
          flat
          label="取消"
          v-close-popup
          />
        <q-btn
          flat
          label="送出"
          @click="submit"
          />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>