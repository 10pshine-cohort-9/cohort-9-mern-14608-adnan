import { useEffect, type ReactNode } from "react";
import { useEditor, EditorContent, useEditorState, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  BoldIcon,
  TextItalicIcon,
  TextUnderlineIcon,
  TextStrikethroughIcon,
  CodeIcon,
  Heading01Icon,
  Heading02Icon,
  Heading03Icon,
  LeftToRightListBulletIcon,
  LeftToRightListNumberIcon,
  QuoteDownIcon,
  SourceCodeIcon,
  UndoIcon,
  RedoIcon,
} from "@hugeicons/core-free-icons";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
}

interface ToolbarButtonProps {
  label: string;
  icon: ReactNode;
  isActive?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

const ICON_SIZE = 18;

const ToolbarButton = ({ label, icon, isActive, disabled, onClick }: ToolbarButtonProps) => (
  <button
    type="button"
    aria-label={label}
    aria-pressed={isActive}
    title={label}
    disabled={disabled}
    onMouseDown={(event) => event.preventDefault()}
    onClick={onClick}
    className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-accent hover:text-accent-foreground disabled:pointer-events-none disabled:opacity-40 ${
      isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
    }`}
  >
    {icon}
  </button>
);

const Toolbar = ({ editor }: { editor: Editor | null }) => {
  const state = useEditorState({
    editor,
    selector: ({ editor }) => ({
      bold: editor?.isActive("bold") ?? false,
      italic: editor?.isActive("italic") ?? false,
      underline: editor?.isActive("underline") ?? false,
      strike: editor?.isActive("strike") ?? false,
      code: editor?.isActive("code") ?? false,
      h1: editor?.isActive("heading", { level: 1 }) ?? false,
      h2: editor?.isActive("heading", { level: 2 }) ?? false,
      h3: editor?.isActive("heading", { level: 3 }) ?? false,
      bulletList: editor?.isActive("bulletList") ?? false,
      orderedList: editor?.isActive("orderedList") ?? false,
      blockquote: editor?.isActive("blockquote") ?? false,
      codeBlock: editor?.isActive("codeBlock") ?? false,
      canUndo: editor?.can().undo() ?? false,
      canRedo: editor?.can().redo() ?? false,
    }),
  });

  if (!editor || !state) return null;

  return (
    <div className="flex flex-wrap items-center gap-1 border-b border-border p-2">
      <ToolbarButton
        label="Bold"
        isActive={state.bold}
        icon={<HugeiconsIcon icon={BoldIcon} size={ICON_SIZE} />}
        onClick={() => editor.chain().focus().toggleBold().run()}
      />
      <ToolbarButton
        label="Italic"
        isActive={state.italic}
        icon={<HugeiconsIcon icon={TextItalicIcon} size={ICON_SIZE} />}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      />
      <ToolbarButton
        label="Underline"
        isActive={state.underline}
        icon={<HugeiconsIcon icon={TextUnderlineIcon} size={ICON_SIZE} />}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      />
      <ToolbarButton
        label="Strikethrough"
        isActive={state.strike}
        icon={<HugeiconsIcon icon={TextStrikethroughIcon} size={ICON_SIZE} />}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      />
      <ToolbarButton
        label="Inline code"
        isActive={state.code}
        icon={<HugeiconsIcon icon={CodeIcon} size={ICON_SIZE} />}
        onClick={() => editor.chain().focus().toggleCode().run()}
      />

      <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />

      <ToolbarButton
        label="Heading 1"
        isActive={state.h1}
        icon={<HugeiconsIcon icon={Heading01Icon} size={ICON_SIZE} />}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
      />
      <ToolbarButton
        label="Heading 2"
        isActive={state.h2}
        icon={<HugeiconsIcon icon={Heading02Icon} size={ICON_SIZE} />}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      />
      <ToolbarButton
        label="Heading 3"
        isActive={state.h3}
        icon={<HugeiconsIcon icon={Heading03Icon} size={ICON_SIZE} />}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      />

      <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />

      <ToolbarButton
        label="Bullet list"
        isActive={state.bulletList}
        icon={<HugeiconsIcon icon={LeftToRightListBulletIcon} size={ICON_SIZE} />}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      />
      <ToolbarButton
        label="Numbered list"
        isActive={state.orderedList}
        icon={<HugeiconsIcon icon={LeftToRightListNumberIcon} size={ICON_SIZE} />}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      />
      <ToolbarButton
        label="Quote"
        isActive={state.blockquote}
        icon={<HugeiconsIcon icon={QuoteDownIcon} size={ICON_SIZE} />}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      />
      <ToolbarButton
        label="Code block"
        isActive={state.codeBlock}
        icon={<HugeiconsIcon icon={SourceCodeIcon} size={ICON_SIZE} />}
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
      />

      <span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />

      <ToolbarButton
        label="Undo"
        disabled={!state.canUndo}
        icon={<HugeiconsIcon icon={UndoIcon} size={ICON_SIZE} />}
        onClick={() => editor.chain().focus().undo().run()}
      />
      <ToolbarButton
        label="Redo"
        disabled={!state.canRedo}
        icon={<HugeiconsIcon icon={RedoIcon} size={ICON_SIZE} />}
        onClick={() => editor.chain().focus().redo().run()}
      />
    </div>
  );
};

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "min-h-[180px] px-3 py-2 text-card-foreground focus:outline-none",
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (current !== content) {
      editor.commands.setContent(content, { emitUpdate: false });
    }
  }, [editor, content]);

  return (
    <div className="rounded-md border border-border bg-card">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
