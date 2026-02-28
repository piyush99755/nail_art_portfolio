import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import StripeProvider from "./stripe/StripeProvider";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
    <StripeProvider>
       <App />
    </StripeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
