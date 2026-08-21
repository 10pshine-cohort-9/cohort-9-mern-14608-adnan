import { render, waitFor, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@/components/theme-provider";

beforeEach(() => {
  document.documentElement.className = "";
  localStorage.clear();
});

it("applies the default theme on mount", async () => {
  render(
    <ThemeProvider defaultTheme="light">
      <span>Theme</span>
    </ThemeProvider>
  );
  await waitFor(() =>
    expect(document.documentElement.classList.contains("light")).toBe(true)
  );
});

it("toggles the theme with the 'd' shortcut", async () => {
  render(
    <ThemeProvider defaultTheme="light">
      <span>Theme</span>
    </ThemeProvider>
  );
  await waitFor(() =>
    expect(document.documentElement.classList.contains("light")).toBe(true)
  );
  fireEvent.keyDown(window, { key: "d" });
  await waitFor(() =>
    expect(document.documentElement.classList.contains("dark")).toBe(true)
  );
  expect(localStorage.getItem("theme")).toBe("dark");
});

it("ignores 'd' when a modifier key is held", async () => {
  render(
    <ThemeProvider defaultTheme="light">
      <span>Theme</span>
    </ThemeProvider>
  );
  await waitFor(() =>
    expect(document.documentElement.classList.contains("light")).toBe(true)
  );
  fireEvent.keyDown(window, { key: "d", ctrlKey: true });
  expect(document.documentElement.classList.contains("dark")).toBe(false);
});

it("ignores non-'d' keys", async () => {
  render(
    <ThemeProvider defaultTheme="light">
      <span>Theme</span>
    </ThemeProvider>
  );
  await waitFor(() =>
    expect(document.documentElement.classList.contains("light")).toBe(true)
  );
  fireEvent.keyDown(window, { key: "a" });
  expect(document.documentElement.classList.contains("dark")).toBe(false);
});

it("updates when the theme changes in another tab", async () => {
  render(
    <ThemeProvider defaultTheme="light" storageKey="tp-storage">
      <span>Theme</span>
    </ThemeProvider>
  );
  await waitFor(() =>
    expect(document.documentElement.classList.contains("light")).toBe(true)
  );
  const event = new Event("storage");
  Object.assign(event, { key: "tp-storage", newValue: "dark", storageArea: localStorage });
  window.dispatchEvent(event);
  await waitFor(() =>
    expect(document.documentElement.classList.contains("dark")).toBe(true)
  );
});

it("toggles from dark to light", async () => {
  render(
    <ThemeProvider defaultTheme="dark">
      <span>Theme</span>
    </ThemeProvider>
  );
  await waitFor(() =>
    expect(document.documentElement.classList.contains("dark")).toBe(true)
  );
  fireEvent.keyDown(window, { key: "d" });
  await waitFor(() =>
    expect(document.documentElement.classList.contains("light")).toBe(true)
  );
  expect(localStorage.getItem("theme")).toBe("light");
});

it("toggles from the system theme", async () => {
  window.matchMedia = jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    addListener: jest.fn(),
    removeListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));
  render(
    <ThemeProvider defaultTheme="system">
      <span>Theme</span>
    </ThemeProvider>
  );
  await waitFor(() =>
    expect(document.documentElement.classList.contains("light")).toBe(true)
  );
  fireEvent.keyDown(window, { key: "d" });
  await waitFor(() =>
    expect(document.documentElement.classList.contains("dark")).toBe(true)
  );
});
