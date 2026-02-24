import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../src/index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { MaterialUIControllerProvider } from "./context/index.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
     <BrowserRouter>
    <MaterialUIControllerProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MaterialUIControllerProvider>
    </BrowserRouter>
  </StrictMode>
);
