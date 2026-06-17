import { CarOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.css';

export default function AppBranding(): React.ReactElement {
  const { t } = useTranslation();
  return (
    <div className={styles.branding}>
      <CarOutlined className={styles.icon} />
      <Typography.Text strong className={styles.title}>
        {t('common.appName')}
      </Typography.Text>
    </div>
  );
}
