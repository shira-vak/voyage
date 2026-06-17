import { App as AntApp, ConfigProvider } from "antd";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { OpenAPI } from "./api/generated";
import "./i18n";
import "./index.css";
import { theme } from "./theme/theme";

OpenAPI.BASE = "/api";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider theme={theme}>
      <AntApp>
        <App />
      </AntApp>
    </ConfigProvider>
  </React.StrictMode>,
);
