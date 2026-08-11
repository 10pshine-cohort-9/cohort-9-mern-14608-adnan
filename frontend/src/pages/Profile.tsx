import { useNavigate } from "react-router";
import { useState } from "react";
import type { ReactElement } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Profile = (): ReactElement => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const handleLogout = async (): Promise<void> => {
    setLogoutError(null);
    try {
      await logout();
      navigate("/login");
    } catch {
      setLogoutError("Logout failed. Please try again.");
    }
  };

  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="flex flex-col items-center gap-2">
          <Avatar className="h-16 w-16 shadow-[0_6px_14px_rgba(0,0,0,0.5)]">
            <AvatarFallback className="[text-shadow:0_1px_3px_rgb(0_0_0/0.3)]">{initials}</AvatarFallback>
          </Avatar>
          <CardTitle>{user?.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-sm text-muted-foreground">{user?.email}</p>
          <Button variant="outline" className="w-full" onClick={() => navigate("/")}>
            Back to notes
          </Button>
          <Button variant="destructive" className="w-full" onClick={handleLogout}>
            Log out
          </Button>
          {logoutError && (
            <p role="alert" className="text-center text-sm text-destructive">{logoutError}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
