import {
  firestoreDb
} from '../../../../lib/firebase'

import {
  getDocs,
  where,
  collection,
  query
} from 'firebase/firestore'

export default defineEventHandler(async (event) => {
  const account = getRouterParam(event, 'account')
  try {
    const q = query(collection(firestoreDb, 'userDetail'), where("account", "==", account));
    const querySnapshot = await getDocs(q);
    const dataList: any[] = []
    querySnapshot.forEach((doc: any) => {
      dataList.push(doc.data())
    });
    return dataList[0]
  } catch (error) {
    console.log('/api/user/account/[account] get error', error)
    throw createError({
      statusCode: 400,
      statusMessage: '取得使用者失敗',
    })
  }
})
