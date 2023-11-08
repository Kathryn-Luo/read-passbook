<script setup>
const props = defineProps({
  label: String,
  rules: Array,
  placeholder: String,
  disabled: Boolean
})

const value = defineModel()
const emit = defineEmits(['submit'])

</script>

<template>
   <div class=" table-row">
    <h4 class=" table-cell text-lg">{{ label }}</h4>
    <q-input
      outlined
      v-model="value"
      :placeholder="placeholder"
      :disable="disabled"
      lazy-rules="ondemand"
      @keyup.enter="$emit('submit')"
      :rules="rules"
      class="table-cell py-2"
      />
  </div>
</template>