import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import PageHeader from '../appLayout/common/PageHeader';

interface TripsHeaderProps {
  onAddTrip: () => void;
}

export function TripsHeader({ onAddTrip }: TripsHeaderProps): React.ReactElement {
  const { t } = useTranslation();

  return (
    <PageHeader
      title={t('trips.title')}
      action={
        <Button type="primary" icon={<PlusOutlined />} onClick={onAddTrip}>
          {t('trips.recordTrip')}
        </Button>
      }
    />
  );
}
