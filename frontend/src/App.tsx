import { BrowserRouter, Routes } from "react-router";
import { AuthProvider } from "@/context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>{/* Routes are added phase by phase below as each page is built */}</Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
