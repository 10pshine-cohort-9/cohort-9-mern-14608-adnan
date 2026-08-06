import { BrowserRouter, Routes, Route } from "react-router";
import type { ReactElement } from "react";
import { AuthProvider } from "@/context/AuthContext";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";

function App(): ReactElement {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
