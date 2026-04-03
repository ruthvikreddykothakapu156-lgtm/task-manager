import { createContext, useContext, useState } from 'react';
import { apiLogin, apiRegister, apiLogout, apiGetMe } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => apiGetMe());

  const login = async (email, password) => {
    const u = await apiLogin(email, password);
    setUser(u);
    return u;
  };

  const register = async (username, email, password) => {
    const u = await apiRegister(username, email, password);
    setUser(u);
    return u;
  };

  const logout = () => {
    apiLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
