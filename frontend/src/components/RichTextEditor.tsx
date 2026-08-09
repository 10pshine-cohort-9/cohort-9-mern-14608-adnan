import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "min-h-[180px] text-card-foreground focus:outline-none",
      },
    },
  });

  return (
    <div className="rounded-md border border-border bg-card p-3">
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
