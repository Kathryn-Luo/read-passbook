import { getAuth } from 'firebase-admin/auth'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const { firebaseIdToken } = await readBody(event);

  // Set session expiration to 5 days.
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  try {
    const sessionCookie = await getAuth().createSessionCookie(firebaseIdToken, { expiresIn })

    setCookie(event, config.public.authCookieName, sessionCookie)

    const token = await getAuth().verifySessionCookie(sessionCookie, true);

    const user = await getAuth().getUser(token.uid);
    
    return { user };
  } catch (error) {
    
  }
})