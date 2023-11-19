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
  <q-header elevated class=" bg-cyan-700">
    <div class="container mx-auto">
      <q-toolbar>
        <q-btn
          flat
          label="Read PassBook"
          to="/"
          />
        <q-space />
        <q-tabs>
          <ClientOnly>
            <q-route-tab
              v-if="firebaseUser"
              name="read-list"
              label="Read Passbook"
              :to="{
                name: 'user-account',
                params: {
                  account: firebaseUserDetail?.account
                }
              }"
              />
            <q-route-tab
              v-if="firebaseUser"
              name="profile"
              label="Profile"
              :to="{
                name: 'user-profile'
              }"
              />
            <q-tab
              v-if="firebaseUser"
              name="SignOut"
              label="SignOut"
              @click="clickSignOut"
              />
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
