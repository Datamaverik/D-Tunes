import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ToastProvider } from "./Contexts/Toast.context.tsx";
import { LoadingProvider } from "./Contexts/Loading.context.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <LoadingProvider>
          <App />
        </LoadingProvider>
      </ToastProvider>
    </BrowserRouter>
  </React.StrictMode>
);
