import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import AuthProvider from "./context/AuthContext";
import { VisaProvider } from "./context/visaContext";
import CommunityProvider from "./context/CommunityContext";


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <VisaProvider>
        
          <App />
        
      </VisaProvider>
    </AuthProvider>
  </React.StrictMode>
);