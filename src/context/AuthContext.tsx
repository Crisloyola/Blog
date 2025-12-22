import { createContext, useContext, useState } from "react";
import type { AuthResponseDto} from "../types/auth.types";
import { UserRole } from "../types/roles.types";

interface AuthContextType {
  user: AuthResponseDto | null;
  token: string | null;
  loginUser: (data: AuthResponseDto) => void;
  logout: () => void;
  isAuthenticated: boolean;
  role: UserRole | null;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthResponseDto | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const loginUser = (data: AuthResponseDto) => {
    setUser(data);
    setToken(data.token);
    localStorage.setItem("token", data.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loginUser,
        logout,
        isAuthenticated: !!token,
        role: user?.role ?? null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
