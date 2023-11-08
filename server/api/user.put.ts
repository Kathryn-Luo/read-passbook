import {
  firestoreDb
} from '../lib/firebase'

import {
  doc,
  updateDoc
} from 'firebase/firestore'



export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  try {
    const updateUserInfo = { ...body }
    const usersCollectionRef = doc(firestoreDb, 'userDetail', updateUserInfo.uid)

    const result = await updateDoc(usersCollectionRef, updateUserInfo)

    return result
  } catch (error) {
    console.log('error')
    console.log(error)
    throw createError({
      statusCode: 400,
      statusMessage: '更新使用者失敗',
    })
  }
})
