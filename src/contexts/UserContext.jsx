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

  const router = useRouter();

  async function login(email, password) {
    await account.createEmailPasswordSession({ email, password });
    const user = await account.get();
    setUser(user);
    setIsLoggedIn(true);
    await fetchProfile(user.$id);
    router.replace("/");
  }

  async function logout() {
    await account.deleteSession({ sessionId: "current" });
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

      setProfile(result);

      // 👇 fetch image from storage
      if (result.avatarId) {
        setProfileImage(getFileUrl(result.avatarId));
      } else {
        setProfileImage(null);
      }
    } catch (err) {
      console.log("Profile fetch failed", err);
      setProfile(null);
      setProfileImage(null);
    }
  }, []);

  const init = useCallback(async () => {
    try {
      await account.getSession("current");
      const user = await account.get();
      setUser(user);
      setIsLoggedIn(true);
      await fetchProfile(user.$id);
    } catch (err) {
      console.log("No active session", err);
      setUser(null);
      setProfile(null);
      setProfileImage(null);
      setIsLoggedIn(false);
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
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
}
