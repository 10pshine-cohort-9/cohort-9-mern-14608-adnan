import { renderHook, waitFor, act } from "@testing-library/react";
import { useAuth } from "@/hooks/useAuth";
import { AuthProvider } from "@/context/AuthContext";

jest.mock("@/lib/http", () => {
  const mock = { get: jest.fn(), post: jest.fn() };
  return { __esModule: true, ...mock, default: mock };
});

import http from "@/lib/http";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

const response = (data: unknown) => ({ json: () => Promise.resolve({ data }) });

beforeEach(() => {
  (http.get as jest.Mock).mockReset();
  (http.post as jest.Mock).mockReset();
});

it("loads the current user on mount", async () => {
  (http.get as jest.Mock).mockReturnValue(response({ _id: "1", name: "Adnan", email: "a@b.com" }));
  const { result } = renderHook(() => useAuth(), { wrapper });
  await waitFor(() =>
    expect(result.current.user).toEqual({ _id: "1", name: "Adnan", email: "a@b.com" })
  );
  expect(result.current.loading).toBe(false);
});

it("logs in and stores the user", async () => {
  (http.get as jest.Mock).mockReturnValue(response(null));
  (http.post as jest.Mock).mockImplementation((path: string) =>
    path === "auth/login" ? response({ _id: "1", name: "Adnan", email: "a@b.com" }) : response(null)
  );
  const { result } = renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(result.current.loading).toBe(false));
  await act(async () => {
    await result.current.login("a@b.com", "pw");
  });
  await waitFor(() =>
    expect(result.current.user).toEqual({ _id: "1", name: "Adnan", email: "a@b.com" })
  );
  expect(http.post).toHaveBeenCalledWith("auth/login", {
    json: { email: "a@b.com", password: "pw" },
  });
});

it("registers and stores the user", async () => {
  (http.get as jest.Mock).mockReturnValue(response(null));
  (http.post as jest.Mock).mockImplementation((path: string) =>
    path === "auth/register" ? response({ _id: "2", name: "Adnan", email: "a@b.com" }) : response(null)
  );
  const { result } = renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(result.current.loading).toBe(false));
  await act(async () => {
    await result.current.register("Adnan", "a@b.com", "pw");
  });
  await waitFor(() =>
    expect(result.current.user).toEqual({ _id: "2", name: "Adnan", email: "a@b.com" })
  );
  expect(http.post).toHaveBeenCalledWith("auth/register", {
    json: { name: "Adnan", email: "a@b.com", password: "pw" },
  });
});

it("logs out and clears the user", async () => {
  (http.get as jest.Mock).mockReturnValue(response({ _id: "1", name: "Adnan", email: "a@b.com" }));
  (http.post as jest.Mock).mockImplementation((path: string) =>
    path === "auth/logout" ? response(null) : response(null)
  );
  const { result } = renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(result.current.user).not.toBeNull());
  await act(async () => {
    await result.current.logout();
  });
  await waitFor(() => expect(result.current.user).toBeNull());
  expect(http.post).toHaveBeenCalledWith("auth/logout");
});

it("keeps the user null when login fails", async () => {
  (http.get as jest.Mock).mockReturnValue(response(null));
  (http.post as jest.Mock).mockReturnValue({ json: () => Promise.reject(new Error("boom")) });
  const { result } = renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(result.current.loading).toBe(false));
  await act(async () => {
    try {
      await result.current.login("a@b.com", "bad");
    } catch {
      /* login rethrows after recording the error */
    }
  });
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.user).toBeNull();
});

it("keeps the user null when registration fails", async () => {
  (http.get as jest.Mock).mockReturnValue(response(null));
  (http.post as jest.Mock).mockReturnValue({ json: () => Promise.reject(new Error("boom")) });
  const { result } = renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(result.current.loading).toBe(false));
  await act(async () => {
    try {
      await result.current.register("Adnan", "a@b.com", "bad");
    } catch {
      /* register rethrows after recording the error */
    }
  });
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.user).toBeNull();
});

it("keeps the user null when the session fetch fails", async () => {
  (http.get as jest.Mock).mockReturnValue({ json: () => Promise.reject(new Error("unauthorized")) });
  const { result } = renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.user).toBeNull();
});

it("rethrows after a failed logout", async () => {
  (http.get as jest.Mock).mockReturnValue(response({ _id: "1", name: "Adnan", email: "a@b.com" }));
  (http.post as jest.Mock).mockReturnValue({ json: () => Promise.reject(new Error("boom")) });
  const { result } = renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(result.current.user).not.toBeNull());
  await act(async () => {
    try {
      await result.current.logout();
    } catch {
      /* logout rethrows after logging the error */
    }
  });
  await waitFor(() => expect(result.current.user).toBeNull());
});
