import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactElement, ReactNode } from "react";
import http from "@/lib/http";
import { AuthContext } from "./auth-context";
import type { User } from "./auth-context";

export const AuthProvider = ({ children }: { children: ReactNode }): ReactElement => {
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

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    try {
      const res = await http.post("auth/login", { json: { email, password } }).json<{ data: User }>();
      setUser(res.data);
    } catch (err) {
      console.error("Login request failed:", err);
      throw err;
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string): Promise<void> => {
    try {
      const res = await http
        .post("auth/register", { json: { name, email, password } })
        .json<{ data: User }>();
      setUser(res.data);
    } catch (err) {
      console.error("Register request failed:", err);
      throw err;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await http.post("auth/logout");
      setUser(null);
    } catch (err) {
      console.error("Logout request failed:", err);
      throw err;
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
