import { Alert, Layout, Menu } from "antd";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { CUSTOM_UNREACHABLE_SERVER_EVENT } from "../utils";
import AppBranding from "./AppBranding";
import styles from "./styles.module.css";

const { Header, Content } = Layout;

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({
  children,
}: AppLayoutProps): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [serverDown, setServerDown] = useState(false);

  useEffect(() => {
    const handler = (): void => setServerDown(true);
    window.addEventListener(CUSTOM_UNREACHABLE_SERVER_EVENT, handler);
    return () =>
      window.removeEventListener(CUSTOM_UNREACHABLE_SERVER_EVENT, handler);
  }, []);

  const navItems = [
    { key: "/trips", label: t("nav.trips") },
    { key: "/vehicles", label: t("nav.vehicles") },
  ];

  return (
    <Layout className={styles.layout}>
      <Header className={styles.header}>
        <AppBranding />
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          items={navItems}
          onClick={({ key }) => navigate(key)}
          className={styles.nav}
        />
      </Header>

      {serverDown && (
        <Alert
          type="error"
          message={t("errors.serverUnreachable")}
          banner
          closable
          onClose={() => setServerDown(false)}
        />
      )}

      <Content className={styles.content}>
        <div className={styles.contentInner}>{children}</div>
      </Content>
    </Layout>
  );
}
