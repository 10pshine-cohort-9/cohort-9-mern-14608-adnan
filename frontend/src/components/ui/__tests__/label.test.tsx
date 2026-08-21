import { render, screen } from "@testing-library/react";
import { Label } from "@/components/ui/label";

it("renders a label associated with a control", () => {
  render(<Label htmlFor="email">Email</Label>);
  const label = screen.getByText("Email");
  expect(label.tagName).toBe("LABEL");
  expect(label).toHaveAttribute("for", "email");
});
