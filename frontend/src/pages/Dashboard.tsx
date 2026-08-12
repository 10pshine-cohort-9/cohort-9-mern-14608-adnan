import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import type { ReactElement } from "react";
import http from "@/lib/http";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ThemeToggle from "@/components/ThemeToggle";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const stripHtml = (html: string): string => html.replace(/<[^>]*>/g, " ").trim();

const Dashboard = (): ReactElement => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let ignore = false;

    const loadNotes = async (): Promise<void> => {
      try {
        setLoading(true);
        setError("");
        const res = await http.get("notes").json<{ data: Note[] }>();
        if (!ignore) setNotes(res.data);
      } catch {
        if (!ignore) setError("Could not load your notes. Try refreshing.");
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    loadNotes();

    return () => {
      ignore = true;
    };
  }, []);

  const handleDelete = async (id: string): Promise<void> => {
    setError("");
    try {
      await http.delete(`notes/${id}`);
      setNotes((prev) => prev.filter((n) => n._id !== id));
    } catch {
      setError("Could not delete that note. Try again.");
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      navigate("/login");
    } catch {
      setError("Could not log out. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold [text-shadow:0_1px_3px_rgb(0_0_0/0.3)]">Hi, {user?.name}</h1>
          <div className="flex gap-2">
            <ThemeToggle />
            <Button variant="outline" onClick={() => navigate("/profile")}>Profile</Button>
            <Button variant="outline" onClick={handleLogout}>Log out</Button>
          </div>
        </div>

        <div className="mb-4">
          <Button onClick={() => navigate("/notes/new")}>+ New note</Button>
        </div>

        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        {loading ? (
          <p className="text-muted-foreground">Loading notes...</p>
        ) : notes.length === 0 ? (
          <p className="text-muted-foreground">No notes yet. Create your first one.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {notes.map((note) => (
              <Card key={note._id}>
                <CardHeader>
                  <CardTitle className="line-clamp-1 text-lg">{note.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm text-muted-foreground">{stripHtml(note.content)}</p>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => navigate(`/notes/${note._id}`)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(note._id)}>
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
