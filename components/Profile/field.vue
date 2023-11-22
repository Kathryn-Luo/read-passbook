<script setup>
const props = defineProps({
  label: String,
  rules: Array,
  placeholder: String,
  disabled: Boolean,
  appendIcon: String,
  afterButton: String,
  afterButtonDisabled: Boolean
})

const value = defineModel()
const emit = defineEmits([
  'submit',
  'clickAppend',
  'clickAfter'
])

</script>

<template>
   <div class=" table-row">
    <h4 class=" table-cell text-lg">{{ label }}</h4>
    <div class="table-cell">
      <q-input
        outlined
        filled
        bottom-slots
        v-model="value"
        :placeholder="placeholder"
        :disable="disabled"
        lazy-rules="ondemand"
        @keyup.enter="$emit('submit')"
        :rules="rules"
        class="">
        <template v-if="appendIcon" v-slot:append>
          <q-icon :name="appendIcon" @click="emit('clickAppend')" />
        </template>
        <template v-if="afterButton" v-slot:after>
          <q-btn
            dense
            flat
            :label="afterButton"
            :disable="afterButtonDisabled"
            @click="emit('clickAfter')"
            />
        </template>
      </q-input>
    </div>
  </div>
</template>