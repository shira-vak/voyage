import { Card, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import type { VehicleResponseDto } from '../../api/generated';
import styles from './VehicleCard.module.css';

interface VehicleCardProps {
  vehicle: VehicleResponseDto;
  onViewSummary: (licensePlate: string) => void;
}

export default function VehicleCard({ vehicle, onViewSummary }: VehicleCardProps): React.ReactElement {
  const { t } = useTranslation();

  return (
    <Card
      hoverable
      onClick={() => onViewSummary(vehicle.licensePlate)}
      styles={{ body: { padding: '20px 24px' } }}
    >
      <div className={styles.header}>
        <div>
          <div className={styles.plateWrapper}>
            <Tag color='green' className={styles.plate}>
              {vehicle.licensePlate}
            </Tag>
          </div>
          <Typography.Text type='secondary' className={styles.vehicleName}>
            {vehicle.name}
          </Typography.Text>
        </div>
        <Typography.Text type='secondary' className={styles.addedDate}>
          {t('vehicles.added', { date: dayjs(vehicle.createdAt).format('MMM D, YYYY') })}
        </Typography.Text>
      </div>
      <Typography.Text type='secondary' className={styles.hint}>
        {t('vehicles.viewSummaryHint')}
      </Typography.Text>
    </Card>
  );
}
