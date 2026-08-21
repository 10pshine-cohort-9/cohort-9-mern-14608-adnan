import { render, screen } from "@testing-library/react";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";

it("renders the avatar primitives", () => {
  render(
    <AvatarGroup>
      <Avatar>
        <AvatarImage src="https://example.com/a.png" alt="pic" />
        <AvatarFallback>AB</AvatarFallback>
        <AvatarBadge />
      </Avatar>
      <AvatarGroupCount>3</AvatarGroupCount>
    </AvatarGroup>
  );
  expect(screen.getByText("AB")).toBeInTheDocument();
  expect(screen.getByText("3")).toBeInTheDocument();
});
