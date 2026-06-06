"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Member } from "@/types";
import API from "@/lib/api";

interface AuthContextType {
  member: Member | null;
  token: string | null;
  login: (token: string, member: Member) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  member: null,
  token: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<Member | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      API.get("/membres/moi")
        .then((res) => setMember(res.data))
        .catch(() => {
          localStorage.removeItem("token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = (t: string, m: Member) => {
    localStorage.setItem("token", t);
    setToken(t);
    setMember(m);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setMember(null);
  };

  return (
    <AuthContext.Provider value={{ member, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
