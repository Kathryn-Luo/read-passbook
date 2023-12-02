export default (errorCode: string) => {
  // errorCode 對應列表： https://firebase.google.com/docs/reference/js/auth?authuser=0#autherrorcodes
  const errorMessage = {
    'auth/email-already-in-use': '此電子郵件已註冊過',
    'auth/wrong-password': '密碼錯誤',
    'auth/user-not-found': '找不到該使用者'
  }
  return errorMessage[errorCode as keyof typeof errorMessage] || ''
}