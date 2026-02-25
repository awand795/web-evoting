import { createContext, useContext, useState } from "react";
import { getCurrentUser, logout as doLogout } from "../services/auth.service";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getCurrentUser);

  function loginUser(userData) {
    setUser(userData);
  }

  function logoutUser() {
    doLogout();
    setUser(null);
  }

  // Update status user di localStorage dan state setelah vote
  function updateUserStatus(status) {
    const updated = { ...user, status };
    localStorage.setItem("user", JSON.stringify(updated));
    setUser(updated);
  }

  const isAdmin = user?.roles?.includes("ROLE_ADMIN") || false;

  return (
    <AuthContext.Provider value={{ user, isAdmin, loginUser, logoutUser, updateUserStatus }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
