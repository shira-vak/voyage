import { CarOutlined, ClockCircleOutlined, DashboardOutlined, FireOutlined } from '@ant-design/icons';
import { Alert, Descriptions, Drawer, Skeleton, Statistic, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { VehicleSummaryDto } from '../../api/generated';
import { VehiclesService } from '../../api/generated';
import styles from './VehicleSummaryDrawer.module.css';

const DRAWER_WIDTH = 420;

interface VehicleSummaryDrawerProps {
  licensePlate: string | null;
  onClose: () => void;
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function VehicleSummaryDrawer({
  licensePlate,
  onClose,
}: VehicleSummaryDrawerProps): React.ReactElement {
  const { t } = useTranslation();
  const [summary, setSummary] = useState<VehicleSummaryDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!licensePlate) return;
    setLoading(true);
    setError(null);
    setSummary(null);
    VehiclesService.vehiclesControllerGetVehicleSummary({ licensePlate })
      .then(setSummary)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : t('vehicles.summary.errorFallback')),
      )
      .finally(() => setLoading(false));
  }, [licensePlate, t]);

  const drawerTitle = (
    <div className={styles.drawerTitle}>
      <CarOutlined className={styles.drawerTitleIcon} />
      <span>{summary?.vehicle.name ?? t('vehicles.summary.defaultTitle')}</span>
    </div>
  );

  return (
    <Drawer title={drawerTitle} open={!!licensePlate} onClose={onClose} width={DRAWER_WIDTH}>
      {loading && <Skeleton active paragraph={{ rows: 6 }} />}

      {error && <Alert type='error' message={error} showIcon />}

      {summary && !loading && (
        <div className={styles.content}>
          <Descriptions column={1} size='small' bordered>
            <Descriptions.Item label={t('vehicles.summary.name')}>
              {summary.vehicle.name}
            </Descriptions.Item>
            <Descriptions.Item label={t('vehicles.summary.licencePlate')}>
              <Typography.Text code>{summary.vehicle.licensePlate}</Typography.Text>
            </Descriptions.Item>
          </Descriptions>

          <div className={styles.statsGrid}>
            <Statistic
              title={t('vehicles.summary.totalTrips')}
              value={summary.tripCount}
              prefix={<CarOutlined />}
            />
            <Statistic
              title={t('vehicles.summary.totalDistance')}
              value={summary.totalDistanceKm.toFixed(1)}
              suffix='km'
              prefix={<DashboardOutlined />}
            />
            <Statistic
              title={t('vehicles.summary.totalFuel')}
              value={summary.totalFuelConsumed.toFixed(2)}
              suffix='L'
              prefix={<FireOutlined />}
            />
            <Statistic
              title={t('vehicles.summary.avgDuration')}
              value={summary.tripCount > 0 ? formatDuration(summary.averageDurationMinutes) : '—'}
              prefix={<ClockCircleOutlined />}
            />
          </div>

          {summary.tripCount > 0 && summary.totalFuelConsumed > 0 && (
            <Statistic
              title={t('vehicles.summary.efficiency')}
              value={(summary.totalDistanceKm / summary.totalFuelConsumed).toFixed(2)}
              suffix='km / L'
              valueStyle={{ color: 'var(--ant-color-primary)' }}
            />
          )}
        </div>
      )}
    </Drawer>
  );
}
