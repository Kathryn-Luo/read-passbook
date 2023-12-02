import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  getIdToken,
  sendEmailVerification,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithRedirect,
  getRedirectResult
} from 'firebase/auth'
import {
  doc,
  onSnapshot,
} from 'firebase/firestore'

export const createUser = async (email: any, password: any) => {
  const auth = getAuth();
  const credentials = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  ).catch((error) => {
    return Promise.reject(error)
  });
  
  if (!credentials?.user?.uid) {
    // 無使用者ID
    throw new Error('無使用者ID')
  }
  await verifiedAuthEmail()
  $fetch(`/api/user/detail/${credentials?.user?.uid}`, {
    method: 'POST',
    body: {
      email,
      account: credentials?.user?.uid,
      uid: credentials?.user?.uid
    }
  })
  return credentials;
};

export const signInUser = async (email: any, password: any) => {
  const auth = getAuth();
  const userCookie = useCookie('userCookie')

  const credentials = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = credentials.user;
  const firebaseIdToken = await getIdToken(user);

  // send firebaseIdToken to server
  const data = await $fetch('/api/login', {
    method: "POST",
    body: JSON.stringify({ firebaseIdToken }),
  });
  console.log('data', data)

  // @ts-ignore
  userCookie.value = user


  return credentials;
};

export const loginWithGoogle = async () => {
  const auth = getAuth();
  const provider = new GoogleAuthProvider();
  // 可選擇不同帳號
  provider.setCustomParameters({
    prompt: 'select_account'
  })
  signInWithRedirect(auth, provider);
}

export const getGoogleLoginUser = async () => {
  const auth = getAuth();
  try {
    const result = await getRedirectResult(auth)
    if (!result) return
    const credential = GoogleAuthProvider.credentialFromResult(result)
    if (!credential) return
    const token = credential?.accessToken;
    const user = result?.user;
    if (!user || !user.uid) return

    let userDetail = await getUserByUid(user.uid)
    if (!userDetail) {
      // 首次以 Google 登入
      userDetail = {
        uid: user.uid,
        email: user.email,
        account: user.uid,
        nickName: user.displayName,
        image: user.photoURL
      }
      $fetch(`/api/user/detail/${user.uid}`, {
        method: 'POST',
        body: userDetail
      })
    }

    saveUserDetailInCookie(userDetail)

    return user
  } catch (error: any) {
    // const errorCode = error.code;
    // const errorMessage = error.message;
    return error
  }
}

/** 驗證 Firebase Auth 的 Email  */
export const verifiedAuthEmail = async () => {
  const auth = getAuth()
  // FIXME
  // @ts-ignore
  return await sendEmailVerification(auth.currentUser)
}

/** 忘記密碼 */
export const authForgetPassword = async (email: string) => {
  const auth = getAuth();
  // FIXME
  // @ts-ignore
  return await sendPasswordResetEmail(auth, email)
}

export function initUser () {
  return new Promise((resolve, reject) => {
    const auth = getAuth()
    const userCookie = useCookie('userCookie')
    const firebaseUser = useFirebaseUser()
    onAuthStateChanged(auth, (user) => {
      if (user) {
        userCookie.value = JSON.stringify(user)
        firebaseUser.value = user
  
        $fetch("/api/auth", {
          method: "POST",
          body: { user },
        });
        resolve(user)
      } else {
        reject()
        //if signed out
      }
    })
  })
}

export const initUserDetail = async (uid: string) => {
  const firebaseUserDetail = useFirebaseUserDetail()
  const userDetailCookie = useCookie('userDetailCookie')
  if (userDetailCookie.value) {
    firebaseUserDetail.value = userDetailCookie.value
  }

  const userDetail = await getUserByUid(uid)
  saveUserDetailInCookie(userDetail)
  return userDetail
}

export function getUserDetailWaitFirebaseLoaded () {
  return new Promise((resolve, reject) => {
    const auth = getAuth()
    const user = auth.currentUser
    if (user) {
      resolve(user)
    } else {
      onAuthStateChanged(auth, async (user) => {
        if (user) {
          resolve(user)
        } else {
          resolve(null)
        }
      })
    }

  })
}

// TODO: 清除使用者資訊
export const signOutUser = async () => {
  const auth = getAuth();
  const result = await auth.signOut();
  const userCookie = useCookie('userCookie')
  userCookie.value = null
  const firebaseUser = useFirebaseUser()
  firebaseUser.value = null
  saveUserDetailInCookie(null)
  
  const router = useRouter()
  router.replace({ name: 'login' })
  return result;
};

/** 更新使用者 */
export const updateUser = async (userInfo: any) => {
  const auth = getAuth();

  const currentUser = auth.currentUser
  if (!currentUser?.uid) {
    console.error('無當前使用者資訊')
    throw createError({
      statusCode: 400,
      message: '無當前使用者資訊',
    })
  }
  if (userInfo?.uid !== currentUser?.uid) {
    console.error('非當前使用者操作')
    throw createError({
      statusCode: 400,
      message: '非當前使用者操作',
    })
  }

  try {
    await $fetch(`/api/user/detail/${currentUser?.uid}`, {
      method: 'put',
      body: userInfo
    })
    await saveUserDetailInCookie(userInfo)
    updateUseFirebaseUserDetail(userInfo)

  } catch (error) {
    console.log('error', error)
  }

  console.log('currentUser', auth.currentUser)

}

// function getDataFromFirestoreOnSnapshot (...docParams: string[]): object {
//   return new Promise ((resolve, reject) => {
//     const { $firestore } = useNuxtApp()
//     // FIXME: ts error: useNuxtApp 出來都是 unknow ?
//     // @ts-ignore
//     const unsubscribe = onSnapshot(doc($firestore, ...docParams), 
//       { includeMetadataChanges: true }, 
//       (doc) => {
//         if (doc.exists()) {
//           resolve(doc.data())
//         } else {
//           reject(doc)
//         }
//       });
//   })
// }

/** 取得使用者資訊 By uid */
export const getUserByUid = async (uid: string = ''): Promise<object> => {
  try {
    if (!uid) {
      throw createError({
        statusCode: 400,
        message: '無使用者uid',
      })
    }
    const result = await $fetch(`/api/user/detail/${uid}`)
    return result as object
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: '取得使用者失敗',
    })
  }
}

export const getUserByAccount = async (account: string) => {
  if (!account) return
  try {
    const userDeatil = await $fetch(`/api/user/account/${account}`)
    return userDeatil
  } catch (error) {
  
  }
}

/** 儲存使用者資訊至 Cookie */
export const saveUserDetailInCookie = async (userDetail: any) => {
  const firebaseUserDetail = useFirebaseUserDetail()
  firebaseUserDetail.value = userDetail
  const userDetailCookie = useCookie('userDetailCookie')
  userDetailCookie.value = JSON.stringify(userDetail)
}

export const updateUseFirebaseUserDetail = (userDetail: object) => {
  const firebaseUserDetail = useFirebaseUserDetail();
  firebaseUserDetail.value = userDetail
}