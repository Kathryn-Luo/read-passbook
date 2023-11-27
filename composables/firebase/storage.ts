import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytes
} from "firebase/storage";

export const uploadImageStorage = async (path: string ,file: File) => {
  const storage = getStorage();
  const storageRef = ref(storage, path + file.name);
  const uploadTask = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(uploadTask.ref)
  return downloadURL
}
export const uploadUserImage = async (file: File) => {
  try {
    const imageUrl = await uploadImageStorage('images/users/', file)
    if (!imageUrl) throw new Error('上傳照片不成功')
    const firebaseUserDetail = useFirebaseUserDetail()
    
    await updateUser({
      image: imageUrl,
      uid: firebaseUserDetail?.value?.uid
    })
    firebaseUserDetail.value = {
      ...firebaseUserDetail.value,
      image: imageUrl
    }
    return imageUrl
  } catch (error) {
    return error
  }
}