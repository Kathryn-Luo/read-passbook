// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to, from) => {
  try {
    const user = await useFirebaseUser()
    // redirect the user to the login page
    if (!user) {
      return navigateTo({
        path: '/login',
        query: {
          redirect: to.fullPath,
        },
      })
    }
  } catch (error) {
    console.log(error)
  }
})