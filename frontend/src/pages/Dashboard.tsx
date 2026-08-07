import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import http from "@/lib/http";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

const stripHtml = (html: string): string => html.replace(/<[^>]*>/g, " ").trim();

const Dashboard = () => {
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
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Hi, {user?.name}</h1>
          <div className="flex gap-2">
            <Link to="/profile"><Button variant="outline">Profile</Button></Link>
            <Button variant="outline" onClick={handleLogout}>Log out</Button>
          </div>
        </div>

        <div className="mb-4">
          <Link to="/notes/new"><Button>+ New note</Button></Link>
        </div>

        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

        {loading ? (
          <p className="text-slate-500">Loading notes...</p>
        ) : notes.length === 0 ? (
          <p className="text-slate-500">No notes yet. Create your first one.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {notes.map((note) => (
              <Card key={note._id}>
                <CardHeader>
                  <CardTitle className="line-clamp-1 text-lg">{note.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3 text-sm text-slate-500">{stripHtml(note.content)}</p>
                  <div className="mt-4 flex gap-2">
                    <Link to={`/notes/${note._id}`}>
                      <Button size="sm" variant="outline">Edit</Button>
                    </Link>
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
