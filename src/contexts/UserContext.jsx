import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  account,
  tablesDB,
  DATABASE_ID,
  PROFILES_TABLE_ID,
  getFileUrl,
  registerPush,
} from "../../lib/appwrite";
import { useRouter } from "expo-router";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider(props) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const router = useRouter();

  async function login(email, password) {
    await account.createEmailPasswordSession({ email, password });

    let user = null;

    try {
      user = await account.get();
    } catch (e) {
      console.log("Failed to fetch user after login", e);
    }

    if (!user) {
      setUser(null);
      setIsLoggedIn(false);
      return;
    }

    setUser(user);
    setIsLoggedIn(true);

    await fetchProfile(user.$id);
    console.log(user);

    // don't block UI
    registerPush(user.$id).catch((err) => console.log("push failed", err));

    router.replace("/");
  }

  async function logout() {
    try {
      await account.deleteSession({ sessionId: "current" });
    } catch {
      // guest or session already gone — ignore
    }

    setUser(null);
    setProfile(null);
    setProfileImage(null);
    setIsLoggedIn(false);

    router.replace("/signin");
  }

  const fetchProfile = useCallback(async (userId) => {
    try {
      const result = await tablesDB.getRow(
        DATABASE_ID,
        PROFILES_TABLE_ID,
        userId
      );
      if (result?.isDeleted) {
        setUser(null);
        setProfile(null);
        setProfileImage(null);
        setIsLoggedIn(false);

        alert("This account has been deleted and can no longer be used.");

        return;
      }

      setProfile(result);

      // 👇 fetch image from storage
      if (result.avatarId) {
        setProfileImage(getFileUrl(result.avatarId));
      } else {
        setProfileImage(null);
      }
    } catch (err) {
      // If unauthorized because session was deleted, treat as logged out
      if (err?.code === 401 || err?.type === "user_unauthorized") {
        setUser(null);
        setIsLoggedIn(false);
        return;
      }

      console.log("Profile fetch failed", err);
      setProfile(null);
      setProfileImage(null);
    }
  }, []);
  async function hydrateAfterSignup() {
    try {
      const user = await account.get();

      if (!user) return;

      setUser(user);
      setIsLoggedIn(true);

      await fetchProfile(user.$id);

      registerPush(user.$id).catch((err) => console.log("push failed", err));

      router.replace("/");
    } catch (e) {
      console.log("Hydrate after signup failed", e);
    }
  }

  const init = useCallback(async () => {
    try {
      const session = await account.getSession("current");

      // If no session -> treat as guest
      if (!session) throw new Error("No session");

      const user = await account.get();

      setUser(user);
      setIsLoggedIn(true);

      await fetchProfile(user.$id);
    } catch (err) {
      // 👇 guests will land here instead of throwing appwide error
      setUser(null);
      setProfile(null);
      setProfileImage(null);
      setIsLoggedIn(false);
    } finally {
      setIsInitializing(false);
    }
  }, [fetchProfile]);

  useEffect(() => {
    init();
  }, [init]);

  return (
    <UserContext.Provider
      value={{
        current: user,
        profile,
        profileImage,
        login,
        logout,
        isLoggedIn,
        isInitializing,
        hydrateAfterSignup,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
