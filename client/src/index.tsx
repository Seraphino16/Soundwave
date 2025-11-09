import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/styles/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { HelmetProvider } from "react-helmet-async";
import { UserProvider } from "./context/UserContext";
import { UserProfileProvider } from "./context/UserProfileContext";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <HelmetProvider>
    <React.StrictMode>
      <UserProvider>
        <UserProfileProvider>
          <App />
        </UserProfileProvider>
      </UserProvider>
    </React.StrictMode>
  </HelmetProvider>
);

reportWebVitals();
