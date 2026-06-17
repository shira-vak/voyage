import { CarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import { Layout, Menu, Typography } from 'antd';
import type { ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const { Header, Content } = Layout;

const NAV_ITEMS = [
  { key: '/trips', label: 'Trips', icon: <EnvironmentOutlined /> },
  { key: '/vehicles', label: 'Vehicles', icon: <CarOutlined /> },
];

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps): React.ReactElement {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Layout style={{ height: '100vh', overflow: 'hidden' }}>
      <Header
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 32,
          background: '#fff',
          borderBottom: '1px solid #f0f0f0',
          padding: '0 32px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <CarOutlined style={{ fontSize: 22, color: '#389e0d' }} />
          <Typography.Text strong style={{ fontSize: 18, color: '#389e0d', letterSpacing: '-0.3px' }}>
            Voyage
          </Typography.Text>
        </div>

        <Menu
          mode='horizontal'
          selectedKeys={[location.pathname]}
          items={NAV_ITEMS}
          onClick={({ key }) => navigate(key)}
          style={{ flex: 1, border: 'none', minWidth: 0 }}
        />
      </Header>

      <Content style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div
          style={{
            padding: '32px 40px',
            maxWidth: 1200,
            width: '100%',
            margin: '0 auto',
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {children}
        </div>
      </Content>
    </Layout>
  );
}
