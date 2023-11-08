<script setup>
const firebaseUser = useFirebaseUser();
const clickSignOut = async () => {
  await signOutUser()
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
        </q-tabs>
      </q-toolbar>
    </div>  
  </q-header>
</template>
