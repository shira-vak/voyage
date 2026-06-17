import { Layout, Menu } from "antd";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
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

      <Content className={styles.content}>
        <div className={styles.contentInner}>{children}</div>
      </Content>
    </Layout>
  );
}
