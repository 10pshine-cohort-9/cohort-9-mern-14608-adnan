import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthContext } from "@/context/auth-context";
import Login from "@/pages/Login";

// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock("react-router", () => require("@/test-utils/react-router-mock"));

const renderWithProviders = (loginMock: jest.Mock) => {
  render(
    <ThemeProvider>
      <BrowserRouter>
        <AuthContext.Provider
          value={{
            user: null,
            loading: false,
            login: loginMock,
            register: jest.fn(),
            logout: jest.fn(),
          }}
        >
          <Login />
        </AuthContext.Provider>
      </BrowserRouter>
    </ThemeProvider>
  );
};

describe("Login page", () => {
  it("renders email and password fields", () => {
    renderWithProviders(jest.fn());
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("calls login with entered credentials on submit", async () => {
    const loginMock = jest.fn().mockResolvedValue(undefined);
    renderWithProviders(loginMock);

    await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(loginMock).toHaveBeenCalledWith("test@example.com", "password123");
  });

  it("shows an error message when login fails", async () => {
    const loginMock = jest.fn().mockRejectedValue(new Error("boom"));
    renderWithProviders(loginMock);

    await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");
    await userEvent.click(screen.getByRole("button", { name: /log in/i }));

    expect(await screen.findByText("Login failed")).toBeInTheDocument();
  });
});
