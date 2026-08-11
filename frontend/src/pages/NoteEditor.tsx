import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import http from "@/lib/http";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/RichTextEditor";

const NoteEditor = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    let ignore = false;

    const loadNote = async (): Promise<void> => {
      try {
        const res = await http.get(`notes/${id}`).json<{ data: { title: string; content: string } }>();
        if (!ignore) {
          setTitle(res.data.title);
          setContent(res.data.content);
        }
      } catch {
        if (!ignore) setError("Could not load that note.");
      }
    };

    if (isEditing) {
      loadNote();
    }

    return () => {
      ignore = true;
    };
  }, [id, isEditing]);

  const handleSave = async (): Promise<void> => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError("Title is required.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      if (isEditing) {
        await http.put(`notes/${id}`, { json: { title: trimmedTitle, content } });
      } else {
        await http.post("notes", { json: { title: trimmedTitle, content } });
      }
      navigate("/");
    } catch {
      setError("Could not save this note. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-2xl space-y-4">
        <Input
          placeholder="Note title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-medium"
        />
        <RichTextEditor content={content} onChange={setContent} />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={saving || !title}>
            {saving ? "Saving..." : "Save"}
          </Button>
          <Button variant="outline" onClick={() => navigate("/")}>Cancel</Button>
        </div>
      </div>
    </div>
  );
};

export default NoteEditor;
