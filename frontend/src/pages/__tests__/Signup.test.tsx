import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthContext } from "@/context/auth-context";
import Signup from "@/pages/Signup";

// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock("react-router", () => require("@/test-utils/react-router-mock"));
jest.mock("ky", () => ({
  isHTTPError: (err: unknown) => err instanceof Error && err.message === "http-error",
}));
jest.mock("@/lib/http", () => {
  const mock = { post: jest.fn() };
  return { __esModule: true, ...mock, default: mock };
});

import http from "@/lib/http";

const renderSignup = (registerMock: jest.Mock) =>
  render(
    <ThemeProvider>
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            user: null,
            loading: false,
            login: jest.fn(),
            register: registerMock,
            logout: jest.fn(),
          }}
        >
          <Signup />
        </AuthContext.Provider>
      </BrowserRouter>
    </ThemeProvider>
  );

beforeEach(() => (http.post as jest.Mock).mockReset());

it("renders the signup form fields", () => {
  renderSignup(jest.fn());
  expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
});

it("submits the form and registers the user", async () => {
  const user = userEvent.setup();
  const registerMock = jest.fn().mockResolvedValue(undefined);
  renderSignup(registerMock);
  try {
    await user.type(screen.getByLabelText(/name/i), "Adnan");
    await user.type(screen.getByLabelText(/email/i), "a@b.com");
    await user.type(screen.getByLabelText(/password/i), "secret1");
    await user.click(screen.getByRole("button", { name: /Sign up/i }));
    await waitFor(() =>
      expect(registerMock).toHaveBeenCalledWith("Adnan", "a@b.com", "secret1")
    );
  } catch (e) {
    throw new Error(`signup submit test failed: ${e}`);
  }
});

it("shows the server error message on a failed registration", async () => {
  const user = userEvent.setup();
  const registerMock = jest.fn().mockRejectedValue(
    Object.assign(new Error("http-error"), { data: { message: "Email taken" } })
  );
  renderSignup(registerMock);
  try {
    await user.type(screen.getByLabelText(/name/i), "Adnan");
    await user.type(screen.getByLabelText(/email/i), "a@b.com");
    await user.type(screen.getByLabelText(/password/i), "secret1");
    await user.click(screen.getByRole("button", { name: /Sign up/i }));
    await waitFor(() => expect(screen.getByText("Email taken")).toBeInTheDocument());
  } catch (e) {
    throw new Error(`signup server-error test failed: ${e}`);
  }
});

it("shows a generic error for non-http failures", async () => {
  const user = userEvent.setup();
  const registerMock = jest.fn().mockRejectedValue(new Error("network"));
  renderSignup(registerMock);
  try {
    await user.type(screen.getByLabelText(/name/i), "Adnan");
    await user.type(screen.getByLabelText(/email/i), "a@b.com");
    await user.type(screen.getByLabelText(/password/i), "secret1");
    await user.click(screen.getByRole("button", { name: /Sign up/i }));
    await waitFor(() => expect(screen.getByText("Signup failed")).toBeInTheDocument());
  } catch (e) {
    throw new Error(`signup generic-error test failed: ${e}`);
  }
});
