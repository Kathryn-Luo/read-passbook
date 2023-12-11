<script setup>
import {
  useQuasar
} from 'quasar'
const firebaseUser = useFirebaseUser();
const firebaseUserDetail = useFirebaseUserDetail();
const $q = useQuasar()
const clickSignOut = async () => {
  $q.dialog({
    title: '確認登出',
    message: '是否登出帳號',
    html: true,
    ok: {
      label: '登出',
    },
    cancel: {
      label: '取消',
      flat: true
    }
  }).onOk(async () => {
    await signOutUser()
  })
}
</script>

<template>
  <q-header
    elevated
    reveal
    class=" bg-cyan-700"
    >
    <div class="container mx-auto">
      <q-toolbar>
        <q-btn
          flat
          label="Read PassBook"
          to="/"
          />
        <q-space />
        <q-tabs inline-label>
          <ClientOnly>
            <q-route-tab
              v-if="firebaseUser"
              class="gt-sm"
              name="read-list"
              label="閱讀紀錄"
              :to="{
                name: 'user-account',
                params: {
                  account: firebaseUserDetail?.account
                }
              }"
              />
            <q-btn-dropdown
              v-if="firebaseUser"
              auto-close
              no-caps
              stretch
              flat
              :label="firebaseUserDetail?.nickName"
              icon="person"
              >
              <q-list>
                <q-item
                  class="lt-md"
                  clickable
                  :to="{
                    name: 'user-account',
                    params: {
                      account: firebaseUserDetail?.account
                    }
                  }"
                  >
                  <q-item-section>閱讀紀錄</q-item-section>
                </q-item>
                <q-item
                  clickable
                  :to="{
                    name: 'user-profile'
                  }"
                  >
                  <q-item-section>個人檔案</q-item-section>
                </q-item>
                <q-item clickable @click="clickSignOut">
                  <q-item-section>登出</q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
            <q-route-tab
              v-else
              name="Login"
              label="Login"
              to="/login"
              />
          </ClientOnly>
        </q-tabs>
      </q-toolbar>
    </div>  
  </q-header>
</template>
