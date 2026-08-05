import { BrowserRouter, Routes } from "react-router";
import type { ReactElement } from "react";
import { AuthProvider } from "@/context/AuthContext";

function App(): ReactElement {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>{/* Routes are added phase by phase below as each page is built */}</Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
