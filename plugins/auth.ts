import { getAuth, onAuthStateChanged } from "firebase/auth";

export default defineNuxtPlugin(async () => {
  const auth = getAuth();
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const user: any = await initUser();
      const userDetail = await initUserDetail(user?.uid)
    }
  });
})