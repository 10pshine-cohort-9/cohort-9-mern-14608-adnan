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
    try {
      await waitFor(() =>
        expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument()
      );
      for (const label of TOOLBAR_LABELS) {
        expect(screen.getByRole("button", { name: label })).toBeInTheDocument();
      }
    } catch (e) {
      throw new Error(`toolbar render test failed: ${e}`);
    }
  });

  it("renders the provided initial content", async () => {
    render(<RichTextEditor content="<p>Hello world</p>" onChange={jest.fn()} />);
    try {
      await waitFor(() => expect(screen.getByText("Hello world")).toBeInTheDocument());
    } catch (e) {
      throw new Error(`initial content test failed: ${e}`);
    }
  });

  it("invokes formatting commands without crashing", async () => {
    const user = userEvent.setup();
    render(<RichTextEditor content="<p>Hi</p>" onChange={jest.fn()} />);
    try {
      await waitFor(() =>
        expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument()
      );
      for (const label of TOOLBAR_LABELS) {
        await user.click(screen.getByRole("button", { name: label }));
      }
    } catch (e) {
      throw new Error(`formatting commands test failed: ${e}`);
    }
  });

  it("syncs external content changes into the editor", async () => {
    const onChange = jest.fn();
    const { rerender } = render(
      <RichTextEditor content="<p>First</p>" onChange={onChange} />
    );
    try {
      await waitFor(() => expect(screen.getByText("First")).toBeInTheDocument());
      rerender(<RichTextEditor content="<p>Second</p>" onChange={onChange} />);
      await waitFor(() => expect(screen.getByText("Second")).toBeInTheDocument());
    } catch (e) {
      throw new Error(`external content sync test failed: ${e}`);
    }
  });

  it("supports undo and redo", async () => {
    const user = userEvent.setup();
    render(<RichTextEditor content="<p>Hello</p>" onChange={jest.fn()} />);
    try {
      await waitFor(() =>
        expect(screen.getByRole("button", { name: "Undo" })).toBeInTheDocument()
      );
      await user.click(screen.getByRole("button", { name: "Undo" }));
      await user.click(screen.getByRole("button", { name: "Redo" }));
    } catch (e) {
      throw new Error(`undo/redo test failed: ${e}`);
    }
  });

  it("marks the active formatting button", async () => {
    render(<RichTextEditor content="<p><strong>bold</strong></p>" onChange={jest.fn()} />);
    try {
      const bold = await screen.findByRole("button", { name: "Bold" });
      expect(bold).toHaveClass("bg-accent");
    } catch (e) {
      throw new Error(`active button test failed: ${e}`);
    }
  });
});
