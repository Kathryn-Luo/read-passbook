<script setup lang="ts">
import {
  date,
  useQuasar
} from 'quasar'
  const $q = useQuasar()
  const { formatDate } = date
  const dialogOpen = defineModel<boolean>()
  const {
    record
  } = defineProps({
    record: {
      type: Object as PropType<ReadRecord>,
      required: true
    }
  })
  const emit = defineEmits(['update'])


  const defauleRecord = {
    note: '',
    notePublic: true,
    startDate: ''
  }

  const currentRecord: any = ref(defauleRecord)

  watch(dialogOpen, isOpen => {
    if (isOpen) {
      currentRecord.value = {
        ...record,
        startDate: formatDate(record.startDateTime, 'YYYY/MM/DD'),
        startTime: formatDate(record.startDateTime, 'HH:mm'),
      }
    } else {
      currentRecord.value = {...defauleRecord}
    }
  })

  const save = () => {
    emit('update', currentRecord.value)
  }
</script>

<template>
  <q-dialog
    v-model="dialogOpen"
    :full-width="$q.screen.lt.md"
    :full-height="$q.screen.lt.md"
    >
    <q-card
      :style="{
        height: '70vh',
        width: '70vw',
        maxWidth: '70vw',
      }"
      class=" flex flex-col"
      >
      <q-card-section class="flex">
        <h2 class=" text-lg font-bold">
        《<span class=" text-cyan-700">{{ record.title }}</span>》閱讀紀錄
        </h2>
      </q-card-section>

      <q-card-section class="flex-1 pt-1 overflow-auto">
        <div class="">
          <label class="inline-block">
            <span class=" mb-1 font-bold">
              是否公開筆記
            </span>
            <q-toggle
              v-model="currentRecord.notePublic"
              />
          </label>
          <div class="block">
            <span  class=" mb-1 font-bold">
              開始閱讀時間
            </span>
            <div class=" inline-flex">
              <q-input
                v-model="currentRecord.startDate"
                mask="date"
                :rules="['date']"
                input-class="cursor-pointer"
                outlined
                dense
                disable
                >
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                  >
                  <q-date
                    v-model="currentRecord.startDate"
                    >
                    <div
                      class="row items-center justify-end"
                      >
                      <q-btn
                        v-close-popup
                        label="確定"
                        color="primary"
                        flat
                        />
                    </div>
                  </q-date>
                </q-popup-proxy>
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                  </q-icon>
                </template>
              </q-input>
              <q-input
                v-model="currentRecord.startTime"
                mask="time"
                :rules="['time']"
                input-class="cursor-pointer"
                outlined
                dense
                disable
                >
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                  >
                  <q-time v-model="currentRecord.startTime">
                    <div class="row items-center justify-end">
                      <q-btn
                        v-close-popup
                        label="確定"
                        color="primary"
                        flat
                        />
                    </div>
                  </q-time>
                </q-popup-proxy>
                <template v-slot:append>
                  <q-icon name="access_time" class="cursor-pointer">
                  </q-icon>
                </template>
              </q-input>
            </div>
          </div>
        </div>
        <div class="">
          <label class="h-full">
            <p class=" mb-1 font-bold">
              閱讀筆記
            </p>
            <q-editor
              class="flex-1 flex flex-col"
              v-model="currentRecord.note"
              max-height="100%"
              content-style="overflow-y: auto;"
              content-class="flex-1 overflow-auto"
              :toolbar="[
                ['bold', 'italic', 'strike', 'underline'],
                ['left', 'center', 'right', 'justify'],
                ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
                ['hr', 'code'],
                ['undo', 'redo']
              ]"
            />
          </label>
        </div>

      </q-card-section>

      <q-card-section
        class="flex-none"
        align="center">
        <q-btn
          label="取消"
          outline
          v-close-popup
          />
        <q-btn
          class="ml-2"
          label="儲存"
          color="primary"
          unelevated
          @click="save"
          />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>