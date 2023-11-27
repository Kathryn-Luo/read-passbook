import {
  firestoreDb
} from '../../../lib/firebase'

import {
  setDoc,
  doc,
} from 'firebase/firestore'

export default defineEventHandler(async (event) => {
  const uid = getRouterParam(event, 'uid')

  const body = await readBody(event)
  const config = useRuntimeConfig()

  try {
    const newUserInfo = { ...body }
    // @ts-ignore
    const usersCollectionRef = doc(firestoreDb, 'userDetail', uid)

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
