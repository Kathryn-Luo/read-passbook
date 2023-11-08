import {
  firestoreDb
} from '../lib/firebase'

import {
  doc,
  getDoc,
} from 'firebase/firestore'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const uid =  query.uid?.toString() || ''
  try {
    const usersCollectionRef = doc(firestoreDb, 'userDetail', uid)
    const docSnap = await getDoc(usersCollectionRef);
    let result = null

    // FIXME: 更新資料後，重整頁面取得的資料會是舊的；清快取才會是新的資料
    // 可先移至 client 使用 onSnapshot 取得
    if (docSnap.exists()) {
      result = docSnap.data() 
    } else {
      // docSnap.data() will be undefined in this case
      console.log("No such document!");
    }
    return result
  } catch (error) {
    console.log(error)
    throw createError({
      statusCode: 400,
      statusMessage: '取得使用者失敗',
    })
  }
})
