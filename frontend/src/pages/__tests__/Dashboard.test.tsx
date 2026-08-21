import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthContext } from "@/context/auth-context";
import Dashboard from "@/pages/Dashboard";

// eslint-disable-next-line @typescript-eslint/no-require-imports
jest.mock("react-router", () => require("@/test-utils/react-router-mock"));
jest.mock("@/lib/http", () => {
  const mock = { get: jest.fn(), delete: jest.fn() };
  return { __esModule: true, ...mock, default: mock };
});

import http from "@/lib/http";

const note = { _id: "n1", title: "Note One", body: "Body" };
const logoutMock = jest.fn();

const renderDash = () =>
  render(
    <ThemeProvider defaultTheme="dark" storageKey="dash">
      <AuthContext.Provider
        value={{
          user: { _id: "1", name: "Adnan", email: "a@b.com" },
          loading: false,
          login: jest.fn(),
          register: jest.fn(),
          logout: logoutMock,
        }}
      >
        <Dashboard />
      </AuthContext.Provider>
    </ThemeProvider>
  );

// Each get/delete call returns a Response whose `.json()` is a controllable promise.
let pendingJson: { resolve: (value: unknown) => void; reject: (reason?: unknown) => void };
const makeResponse = () => ({
  json: () =>
    new Promise((resolve, reject) => {
      pendingJson = { resolve, reject };
    }),
});

beforeEach(() => {
  (http.get as jest.Mock).mockReset();
  (http.delete as jest.Mock).mockReset();
  logoutMock.mockReset();
  (http.get as jest.Mock).mockImplementation(() => makeResponse());
  (http.delete as jest.Mock).mockResolvedValue(undefined);
});

it("shows loading then the list of notes", async () => {
  renderDash();
  expect(screen.getByText(/Loading notes/i)).toBeInTheDocument();
  act(() => {
    pendingJson.resolve({ data: [note] });
  });
  await waitFor(() => expect(screen.getByText("Note One")).toBeInTheDocument());
});

it("deletes a note", async () => {
  renderDash();
  act(() => {
    pendingJson.resolve({ data: [note] });
  });
  await waitFor(() => expect(screen.getByText("Note One")).toBeInTheDocument());
  fireEvent.click(screen.getByRole("button", { name: /Delete/i }));
  act(() => {
    pendingJson.resolve({ data: [note] });
  });
  await waitFor(() => expect(screen.getByText("Note One")).toBeInTheDocument());
  expect(http.delete).toHaveBeenCalledWith("notes/n1");
});

it("shows an error when notes fail to load", async () => {
  renderDash();
  act(() => {
    pendingJson.reject(new Error("boom"));
  });
  await waitFor(() =>
    expect(screen.getByText(/Could not load your notes/i)).toBeInTheDocument()
  );
});

it("reverts the note and shows an error when deletion fails", async () => {
  renderDash();
  act(() => {
    pendingJson.resolve({ data: [note] });
  });
  await waitFor(() => expect(screen.getByText("Note One")).toBeInTheDocument());
  (http.delete as jest.Mock).mockRejectedValue(new Error("boom"));
  fireEvent.click(screen.getByRole("button", { name: /Delete/i }));
  await waitFor(() => expect(screen.getByText("Note One")).toBeInTheDocument());
  expect(screen.getByText(/Could not delete that note/i)).toBeInTheDocument();
});

it("shows an empty state when there are no notes", async () => {
  renderDash();
  act(() => {
    pendingJson.resolve({ data: [] });
  });
  await waitFor(() =>
    expect(screen.getByText(/No notes yet/i)).toBeInTheDocument()
  );
});

it("logs the user out", async () => {
  renderDash();
  act(() => {
    pendingJson.resolve({ data: [note] });
  });
  await waitFor(() => expect(screen.getByText("Note One")).toBeInTheDocument());
  fireEvent.click(screen.getByRole("button", { name: /Log out/i }));
  expect(logoutMock).toHaveBeenCalled();
});
