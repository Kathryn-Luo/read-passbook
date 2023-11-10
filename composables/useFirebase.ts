import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  getIdToken
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
    const errorCode = error.code;
    const errorMessage = error.message;
    return Promise.reject(error)
  });
  
  $fetch(`/api/user/${credentials?.user?.uid}`, {
    method: 'POST',
    body: {
      email,
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
  userCookie.value = data


  return credentials;
};

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

// TODO: 清除使用者資訊
export const signOutUser = async () => {
  const auth = getAuth();
  const result = await auth.signOut();
  const firebaseUser = useFirebaseUser()
  firebaseUser.value = null
  saveUserDetailInCookie(null)
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
      statusMessage: '無當前使用者資訊',
    })
  }
  if (userInfo?.uid !== currentUser?.uid) {
    console.error('非當前使用者操作')
    throw createError({
      statusCode: 400,
      statusMessage: '非當前使用者操作',
    })
  }

  try {
    await $fetch(`/api/user/${currentUser?.uid}`, {
      method: 'put',
      body: userInfo
    })
    await saveUserDetailInCookie(userInfo)

  } catch (error) {
    console.log('error', error)
  }

  console.log('currentUser', auth.currentUser)

}


/** 取得使用者資訊 By uid */
export const getUserByUid = async (uid: string = '') => {
  try {
    if (!uid) {
      throw createError({
        statusCode: 400,
        message: '無使用者uid',
      })
    }
    const result = await $fetch(`/api/user/${uid}`)
    return result
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: '取得使用者失敗',
    })
  }
}

  }
}

/** 儲存使用者資訊至 Cookie */
export const saveUserDetailInCookie = async (userDetail: any) => {
  const firebaseUserDetail = useFirebaseUserDetail()
  firebaseUserDetail.value = userDetail
  const userDetailCookie = useCookie('userDetailCookie')
  userDetailCookie.value = JSON.stringify(userDetail)
}
