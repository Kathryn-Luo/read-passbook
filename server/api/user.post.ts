import {
  firestoreDb
} from '../lib/firebase'

import {
  setDoc,
  doc,
} from 'firebase/firestore'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig()

  try {
    
    const newUserInfo = { ...body }
    const usersCollectionRef = doc(firestoreDb, 'userDetail', newUserInfo.uid)

    const result = await setDoc(usersCollectionRef, {
      ...config.public.defaultUserDetail,
      ...newUserInfo
    })

    return result

  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage: '建立使用者失敗',
    })
  }
})
