import {
  collection,
  addDoc,
  Timestamp,
  setDoc,
  doc,
  writeBatch,
  query,
  orderBy,
  where,
  getDoc,
  getDocs,
  deleteDoc,
  updateDoc
} from 'firebase/firestore'



export const getBook = async (is: string) => {

}

export const updateBook = async (id: string, book: object) => {

}

export const addBook = async (book: object) => {
  const nuxtApp = useNuxtApp()
  const firebaseDB = nuxtApp.$firestore

  // FIXME
  // @ts-ignore
  await setDoc(doc(firebaseDB, 'userReadBooks', book.id), {
    ...book,
    startDateTime: Timestamp.fromDate(new Date()),
  });
  
}

export const addBooks = async (books: object[]) => {
  const nuxtApp = useNuxtApp()
  const firebaseDB = nuxtApp.$firestore
  // Get a new write batch
  // FIXME
  // @ts-ignore
  const batch = writeBatch(firebaseDB)

  books.forEach(book => {
    // FIXME
    // @ts-ignore
    const nycRef = doc(firebaseDB, 'book', book.id);
    batch.set(nycRef, book);
  })

  // Commit the batch
  const result = await batch.commit()
  return result
}

export const addUserReadBooks = async (userId: string, books: object[]) => {
  const nuxtApp = useNuxtApp()
  const firebaseDB = nuxtApp.$firestore
  try {
    // FIXME
    // @ts-ignore
    const batch = writeBatch(firebaseDB);
    await books.forEach((book: any) => {
      // FIXME
      // @ts-ignore
      const docRef = doc(collection(firebaseDB, 'userReadBooks'));
      const bookData = {
        bookId: book?.id,
        title: book?.title,
        userId: userId,
        startDateTime: Timestamp.fromDate(new Date()),
      }
      batch.set(docRef, bookData)
    })

    const result = await batch.commit()
    return result
  } catch (error) {
    console.log('catch', error)
    return error
  }
}

export const getUserReadBooks = async (userId: string) => {
  const nuxtApp = useNuxtApp()
  const firebaseDB = nuxtApp.$firestore

  // FIXME
  // @ts-ignore
  const userReadBooksRef = collection(firebaseDB, 'userReadBooks')
  try {
    // FIXME
    // @ts-ignore
    const q = query(userReadBooksRef, where('userId', '==', userId), orderBy('startDateTime'));
    const querySnapshot = await getDocs(q)
    const userReadBooksList: any[] = []
    querySnapshot.forEach((doc) => {
      userReadBooksList.push({
        id: doc.id,
        ...doc.data()
      })
    })
    return userReadBooksList
  } catch (error) {
    return error
  }
}

const getFirestoreTimestamp = (date: Date) => {
  return date instanceof Timestamp ? date : Timestamp.fromDate(date)
}
export const updateUserReadBook = async (readBookId: string, book: any) => {
  const nuxtApp = useNuxtApp()
  const firebaseDB = nuxtApp.$firestore
  // FIXME
  // @ts-ignore
  const userReadBookDoc = doc(firebaseDB, 'userReadBooks', readBookId);

  const updateBook = {
    ...book,
    updateBook: getFirestoreTimestamp(book.startDateTime)
  }
  if (book.endDateTime) {
    updateBook.endDateTime = getFirestoreTimestamp(book.endDateTime)
  }
  try {
    const result = await setDoc(userReadBookDoc, updateBook)
    return result
  } catch (error) {
    return error
  }
}
export const deleteUserReadBook = async (readBookId: string) => {
  const nuxtApp = useNuxtApp()
  const firebaseDB = nuxtApp.$firestore
  const auth :any = nuxtApp.$auth
  // FIXME
  // @ts-ignore
  const userReadBookDoc = doc(firebaseDB, 'userReadBooks', readBookId);
  const docSnap = await getDoc(userReadBookDoc);
  const isSameUser = docSnap.exists() && auth?.currentUser?.uid && (docSnap.data()?.userId === auth?.currentUser?.uid)

  if (!isSameUser) {
    throw new Error('不可刪除他人閱讀紀錄')
  }
  await deleteDoc(userReadBookDoc)
}


