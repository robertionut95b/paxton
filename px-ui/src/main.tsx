import App from "@app/index";
import { ProtectedApp } from "@app/ProtectedApp";
import AuthProvider from "@features/auth/providers/AppAuthProvider";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <ProtectedApp>
        <App />
      </ProtectedApp>
    </AuthProvider>
  </React.StrictMode>,
);
