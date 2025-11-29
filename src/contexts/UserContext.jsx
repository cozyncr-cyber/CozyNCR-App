import { createContext, useContext, useEffect, useState } from "react";
import { account } from "../../lib/appwrite";
import { useRouter } from "expo-router";

const UserContext = createContext();

export function useUser() {
  return useContext(UserContext);
}
export function UserProvider(props) {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  async function login(email, password) {
    console.log("Logging in", email);
    await account.createEmailPasswordSession({ email, password });
    const user = await account.get();
    setUser(user);
    setIsLoggedIn(true);
    router.replace("/");
  }

  async function logout() {
    await account.deleteSession({ sessionId: "current" });
    setUser(null);
    setIsLoggedIn(false);
    router.replace("/signin");
  }
  async function init() {
    try {
      await account.getSession("current"); // only checks
      const user = await account.get(); // fetch user
      setUser(user);
      setIsLoggedIn(true);
    } catch (err) {
      console.log("No active session", err);
      setUser(null);
      setIsLoggedIn(false); // DO NOT redirect here
    }
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <UserContext.Provider value={{ current: user, login, logout, isLoggedIn }}>
      {props.children}
    </UserContext.Provider>
  );
}
