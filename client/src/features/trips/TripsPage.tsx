import { PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Table, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useState } from 'react';
import type { TripResponseDto } from '../../api/generated';
import { useVehicles } from '../vehicles/useVehicles';
import CreateTripModal from './CreateTripModal';
import TripFilters from './TripFilters';
import { useTrips } from './useTrips';

const PAGE_SIZE = 20;

function buildQuery(
  licensePlate: string | undefined,
  dateRange: [Dayjs, Dayjs] | null,
  page: number,
) {
  return {
    ...(licensePlate && { licensePlate }),
    ...(dateRange && {
      startDate: dateRange[0].startOf('day').toISOString(),
      endDate: dateRange[1].endOf('day').toISOString(),
    }),
    page,
    limit: PAGE_SIZE,
  };
}

const COLUMNS: ColumnsType<TripResponseDto> = [
  {
    title: 'Started',
    dataIndex: 'startedAt',
    render: (v: string) => dayjs(v).format('YYYY-MM-DD HH:mm'),
  },
  {
    title: 'Ended',
    dataIndex: 'endedAt',
    render: (v: string) => dayjs(v).format('YYYY-MM-DD HH:mm'),
  },
  {
    title: 'Duration',
    dataIndex: 'durationMinutes',
    render: (v: number) => {
      const h = Math.floor(v / 60);
      const m = v % 60;
      return h > 0 ? `${h}h ${m}m` : `${m}m`;
    },
  },
  {
    title: 'Distance (km)',
    dataIndex: 'distanceKm',
    render: (v: number) => v.toFixed(1),
    align: 'right',
  },
  {
    title: 'Fuel / Energy',
    dataIndex: 'fuelConsumed',
    render: (v: number) => `${v.toFixed(2)} L`,
    align: 'right',
  },
  {
    title: 'Efficiency',
    key: 'efficiency',
    render: (_: unknown, row: TripResponseDto) =>
      row.distanceKm > 0 ? (
        <Tag color='green'>{(row.distanceKm / row.fuelConsumed).toFixed(1)} km/L</Tag>
      ) : (
        '—'
      ),
    align: 'right',
  },
];

export default function TripsPage(): React.ReactElement {
  const [licensePlate, setLicensePlate] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs] | null>(null);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const query = buildQuery(licensePlate, dateRange, page);
  const { result, loading, error, reload } = useTrips(query);
  const { vehicles } = useVehicles();

  const handleFilterLicensePlate = (plate: string | undefined): void => {
    setLicensePlate(plate);
    setPage(1);
  };

  const handleFilterDateRange = (range: [Dayjs, Dayjs] | null): void => {
    setDateRange(range);
    setPage(1);
  };

  const handleCreated = (): void => {
    setModalOpen(false);
    reload();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <Typography.Title level={3} style={{ margin: 0 }}>
          Trips
        </Typography.Title>
        <Button type='primary' icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
          Record Trip
        </Button>
      </div>

      <TripFilters
        vehicles={vehicles}
        licensePlate={licensePlate}
        dateRange={dateRange}
        onLicensePlateChange={handleFilterLicensePlate}
        onDateRangeChange={handleFilterDateRange}
      />

      {error && <Alert type='error' message={error} showIcon />}

      <Table<TripResponseDto>
        rowKey='tripId'
        columns={COLUMNS}
        dataSource={result?.data ?? []}
        loading={loading}
        pagination={{
          current: page,
          pageSize: PAGE_SIZE,
          total: result?.totalTrips ?? 0,
          onChange: setPage,
          showSizeChanger: false,
          showTotal: (total) => `${total} trips`,
        }}
        locale={{ emptyText: 'No trips found' }}
        size='middle'
      />

      <CreateTripModal
        open={modalOpen}
        vehicles={vehicles}
        onClose={() => setModalOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
