import { Typography } from 'antd';
import type { ReactNode } from 'react';
import styles from './styles.module.css';

interface PageHeaderProps {
  title: string;
  action: ReactNode;
}

export default function PageHeader({ title, action }: PageHeaderProps): React.ReactElement {
  return (
    <div className={styles.header}>
      <Typography.Title level={3} className={styles.title}>
        {title}
      </Typography.Title>
      {action}
    </div>
  );
}
