import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();
  useEffect(() => {
    const token = sessionStorage.getItem("societyToken");
    setIsAuthenticated(!!token);
  }, []);
  const login = (token: string) => {
    sessionStorage.setItem("societyToken", token);
    setIsAuthenticated(true);
  };
  const logout = () => {
    sessionStorage.removeItem("societyToken");
    setIsAuthenticated(false);
    navigate("/");
  };
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
