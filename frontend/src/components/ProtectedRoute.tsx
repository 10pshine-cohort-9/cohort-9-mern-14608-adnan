import { Navigate, Outlet } from "react-router";
import type { ReactElement } from "react";
import { useAuth } from "@/hooks/useAuth";

const ProtectedRoute = (): ReactElement => {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <Outlet />;
};

export default ProtectedRoute;
