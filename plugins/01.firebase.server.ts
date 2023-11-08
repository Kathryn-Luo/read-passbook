const admin = require("firebase-admin");
import { getAuth } from 'firebase-admin/auth'
import { getFirestore } from 'firebase-admin/firestore'
const serviceAccount = require('~/service-account.json');
const nuxtApp = useNuxtApp()

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export const auth = getAuth(app)
export const firestore = getFirestore(app)

nuxtApp.vueApp.provide('auth', auth)
nuxtApp.provide('auth', auth)

nuxtApp.vueApp.provide('firestore', firestore)
nuxtApp.provide('firestore', firestore)
