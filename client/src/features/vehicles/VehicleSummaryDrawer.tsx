import { CarOutlined, ClockCircleOutlined, DashboardOutlined, FireOutlined } from '@ant-design/icons';
import { Alert, Descriptions, Drawer, Skeleton, Statistic, Typography } from 'antd';
import { useEffect, useState } from 'react';
import { vehiclesApi } from '../../api/vehicles';
import type { VehicleSummaryResponse } from '../../api/types';

interface VehicleSummaryDrawerProps {
  vehicleId: string | null;
  onClose: () => void;
}

export default function VehicleSummaryDrawer({
  vehicleId,
  onClose,
}: VehicleSummaryDrawerProps): React.ReactElement {
  const [summary, setSummary] = useState<VehicleSummaryResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!vehicleId) return;
    setLoading(true);
    setError(null);
    setSummary(null);
    vehiclesApi
      .getSummary(vehicleId)
      .then(setSummary)
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Failed to load summary'))
      .finally(() => setLoading(false));
  }, [vehicleId]);

  const avgH = Math.floor((summary?.averageDurationMinutes ?? 0) / 60);
  const avgM = (summary?.averageDurationMinutes ?? 0) % 60;
  const avgLabel = avgH > 0 ? `${avgH}h ${avgM}m` : `${avgM}m`;

  return (
    <Drawer
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CarOutlined style={{ color: '#389e0d' }} />
          <span>{summary?.vehicle.name ?? 'Vehicle Summary'}</span>
        </div>
      }
      open={!!vehicleId}
      onClose={onClose}
      width={420}
    >
      {loading && <Skeleton active paragraph={{ rows: 6 }} />}

      {error && <Alert type='error' message={error} showIcon />}

      {summary && !loading && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Descriptions column={1} size='small' bordered>
            <Descriptions.Item label='Name'>{summary.vehicle.name}</Descriptions.Item>
            <Descriptions.Item label='Licence Plate'>
              <Typography.Text code>{summary.vehicle.licensePlate}</Typography.Text>
            </Descriptions.Item>
          </Descriptions>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Statistic
              title='Total Trips'
              value={summary.tripCount}
              prefix={<CarOutlined />}
            />
            <Statistic
              title='Total Distance'
              value={summary.totalDistanceKm.toFixed(1)}
              suffix='km'
              prefix={<DashboardOutlined />}
            />
            <Statistic
              title='Total Fuel / Energy'
              value={summary.totalFuelConsumed.toFixed(2)}
              suffix='L'
              prefix={<FireOutlined />}
            />
            <Statistic
              title='Avg Trip Duration'
              value={summary.tripCount > 0 ? avgLabel : '—'}
              prefix={<ClockCircleOutlined />}
            />
          </div>

          {summary.tripCount > 0 && summary.totalFuelConsumed > 0 && (
            <Statistic
              title='Fleet Efficiency'
              value={(summary.totalDistanceKm / summary.totalFuelConsumed).toFixed(2)}
              suffix='km / L'
              valueStyle={{ color: '#389e0d' }}
            />
          )}
        </div>
      )}
    </Drawer>
  );
}
