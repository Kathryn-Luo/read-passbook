export default defineNuxtRouteMiddleware(async (to, from) => {
  try {
    const userCookie = useCookie('userCookie')
    // redirect the user to the login page
    if (!userCookie.value) {
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