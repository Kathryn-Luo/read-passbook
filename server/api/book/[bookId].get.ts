import {
  firestoreDb
} from '../../lib/firebase'

import {
  doc,
  getDoc
} from 'firebase/firestore'

export default defineEventHandler(async (event) => {
  const bookId = getRouterParam(event, 'bookId') || ''
  if (!bookId) {
    throw createError({
      statusCode: 400,
      statusMessage: '缺少bookId',
    })
  }
  try {
    const userReadBookDoc = doc(firestoreDb, 'book', bookId);
    const docSnap = await getDoc(userReadBookDoc)
    return docSnap.data()
  } catch (error) {
    console.log('/api/book/[bookId] get error', error)
    throw createError({
      statusCode: 400,
      statusMessage: '取得書籍失敗',
    })
  }
})
