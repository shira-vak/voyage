import { App as AntApp, ConfigProvider } from 'antd';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { OpenAPI } from './api/generated';
import './index.css';

OpenAPI.BASE = '/api';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#389e0d',
          colorSuccess: '#52c41a',
          colorLink: '#389e0d',
          borderRadius: 6,
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
        components: {
          Menu: {
            itemSelectedColor: '#389e0d',
            itemSelectedBg: '#f6ffed',
          },
        },
      }}
    >
      <AntApp>
        <App />
      </AntApp>
    </ConfigProvider>
  </React.StrictMode>,
);
