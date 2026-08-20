import { createElement } from "react";
import type { ReactNode } from "react";

export const BrowserRouter = ({ children }: { children: ReactNode }) =>
  createElement("div", null, children);
export const Routes = ({ children }: { children: ReactNode }) =>
  createElement("div", null, children);
export const Route = () => null;
export const Outlet = () => null;
export const Link = ({ to, children, ...props }: { to: string; children: ReactNode; [key: string]: unknown }) =>
  createElement("a", { href: to, ...props }, children);
export const Navigate = () => null;
export const useNavigate = () => jest.fn();
export const useParams = () => ({});
