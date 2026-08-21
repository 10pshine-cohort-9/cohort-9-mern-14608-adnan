import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RichTextEditor from "@/components/RichTextEditor";

const TOOLBAR_LABELS = [
  "Bold",
  "Italic",
  "Underline",
  "Strikethrough",
  "Inline code",
  "Heading 1",
  "Heading 2",
  "Heading 3",
  "Bullet list",
  "Numbered list",
  "Quote",
  "Code block",
];

describe("RichTextEditor", () => {
  it("renders the editor with a full toolbar", async () => {
    render(<RichTextEditor content="" onChange={jest.fn()} />);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument()
    );
    for (const label of TOOLBAR_LABELS) {
      expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
    }
  });

  it("renders the provided initial content", async () => {
    render(<RichTextEditor content="<p>Hello world</p>" onChange={jest.fn()} />);
    await waitFor(() => expect(screen.getByText("Hello world")).toBeInTheDocument());
  });

  it("invokes formatting commands without crashing", async () => {
    const user = userEvent.setup();
    render(<RichTextEditor content="<p>Hi</p>" onChange={jest.fn()} />);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument()
    );
    for (const label of TOOLBAR_LABELS) {
      await user.click(screen.getByRole("button", { name: label }));
    }
  });

  it("syncs external content changes into the editor", async () => {
    const onChange = jest.fn();
    const { rerender } = render(
      <RichTextEditor content="<p>First</p>" onChange={onChange} />
    );
    await waitFor(() => expect(screen.getByText("First")).toBeInTheDocument());
    rerender(<RichTextEditor content="<p>Second</p>" onChange={onChange} />);
    await waitFor(() => expect(screen.getByText("Second")).toBeInTheDocument());
  });

  it("supports undo and redo", async () => {
    const user = userEvent.setup();
    render(<RichTextEditor content="<p>Hello</p>" onChange={jest.fn()} />);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument()
    );
    await user.click(screen.getByRole("button", { name: "Undo" }));
    await user.click(screen.getByRole("button", { name: "Redo" }));
  });

  it("marks the active formatting button", async () => {
    render(<RichTextEditor content="<p><strong>bold</strong></p>" onChange={jest.fn()} />);
    const bold = await screen.findByRole("button", { name: "Bold" });
    expect(bold).toHaveClass("bg-accent");
  });
});
