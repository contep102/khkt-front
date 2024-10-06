import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AppProvider } from "./Context/Context.jsx";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import { Provider } from "react-redux";
import store from "./app/store.js";
import { Buffer } from "buffer";
import process from "process";
window.global = window;
window.Buffer = Buffer;
window.process = process;

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <AppProvider>
        <App />
      </AppProvider>
    </Provider>
  </BrowserRouter>
);
