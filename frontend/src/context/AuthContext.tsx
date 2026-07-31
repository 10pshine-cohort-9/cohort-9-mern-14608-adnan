import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import http from "@/lib/http";
import { AuthContext } from "./auth-context";
import type { User } from "./auth-context";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let ignore = false;

    const loadUser = async (): Promise<void> => {
      try {
        const res = await http.get("auth/me").json<{ data: User }>();
        if (!ignore) setUser(res.data);
      } catch {
        if (!ignore) setUser(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadUser();

    return () => {
      ignore = true;
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const res = await http.post("auth/login", { json: { email, password } }).json<{ data: User }>();
    setUser(res.data);
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    const res = await http
      .post("auth/register", { json: { name, email, password } })
      .json<{ data: User }>();
    setUser(res.data);
  };

  const logout = async (): Promise<void> => {
    await http.post("auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
