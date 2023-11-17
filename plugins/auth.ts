export default defineNuxtPlugin(async () => {
  const user: any = await initUser();
  const userDetail = await initUserDetail(user?.uid)
})