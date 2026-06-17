import { PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Table, Tag, Typography } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import type { TripResponseDto, VehicleResponseDto } from '../../api/generated';
import { useVehicles } from '../vehicles/useVehicles';
import CreateTripModal from './CreateTripModal';
import TripFilters from './TripFilters';
import { useTrips } from './useTrips';

const PAGE_SIZE = 20;

interface TripsQuery {
  licensePlate?: string;
  startDate?: string;
  endDate?: string;
  page: number;
  limit: number;
}

function buildQuery(
  licensePlate: string | undefined,
  startDate: Dayjs | null,
  endDate: Dayjs | null,
  page: number,
): TripsQuery {
  return {
    ...(licensePlate && { licensePlate }),
    ...(startDate && { startDate: startDate.startOf('day').toISOString() }),
    ...(endDate && { endDate: endDate.endOf('day').toISOString() }),
    page,
    limit: PAGE_SIZE,
  };
}

function buildColumns(vehicleMap: Map<string, VehicleResponseDto>): ColumnsType<TripResponseDto> {
  const sorterNum = (key: keyof TripResponseDto) =>
    (a: TripResponseDto, b: TripResponseDto) => (a[key] as number) - (b[key] as number);

  const sorterDate = (key: keyof TripResponseDto) =>
    (a: TripResponseDto, b: TripResponseDto) =>
      new Date(a[key] as string).getTime() - new Date(b[key] as string).getTime();

  const vehicleName: ColumnType<TripResponseDto> = {
    title: 'Vehicle Name',
    key: 'vehicleName',
    sorter: (a, b) => {
      const nameA = vehicleMap.get(a.vehicleId)?.name ?? '';
      const nameB = vehicleMap.get(b.vehicleId)?.name ?? '';
      return nameA.localeCompare(nameB);
    },
    render: (_: unknown, row: TripResponseDto) => vehicleMap.get(row.vehicleId)?.name ?? '—',
  };

  const licensePlate: ColumnType<TripResponseDto> = {
    title: 'License Plate',
    key: 'licensePlate',
    sorter: (a, b) => {
      const plateA = vehicleMap.get(a.vehicleId)?.licensePlate ?? '';
      const plateB = vehicleMap.get(b.vehicleId)?.licensePlate ?? '';
      return plateA.localeCompare(plateB);
    },
    render: (_: unknown, row: TripResponseDto) => {
      const plate = vehicleMap.get(row.vehicleId)?.licensePlate;
      return plate ? <Tag color='green'>{plate}</Tag> : '—';
    },
  };

  return [
    vehicleName,
    licensePlate,
    {
      title: 'Duration',
      dataIndex: 'durationMinutes',
      sorter: sorterNum('durationMinutes'),
      render: (v: number) => {
        const h = Math.floor(v / 60);
        const m = v % 60;
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
      },
    },
    {
      title: 'Distance (km)',
      dataIndex: 'distanceKm',
      sorter: sorterNum('distanceKm'),
      render: (v: number) => v.toFixed(1),
      align: 'right',
    },
    {
      title: 'Fuel / Energy',
      dataIndex: 'fuelConsumed',
      sorter: sorterNum('fuelConsumed'),
      render: (v: number) => `${v.toFixed(2)} L`,
      align: 'right',
    },
    {
      title: 'Efficiency',
      key: 'efficiency',
      sorter: (a: TripResponseDto, b: TripResponseDto) =>
        a.distanceKm / a.fuelConsumed - b.distanceKm / b.fuelConsumed,
      render: (_: unknown, row: TripResponseDto) =>
        row.distanceKm > 0 ? (
          <Tag color='green'>{(row.distanceKm / row.fuelConsumed).toFixed(1)} km/L</Tag>
        ) : (
          '—'
        ),
      align: 'right',
    },
    {
      title: 'Started',
      dataIndex: 'startedAt',
      sorter: sorterDate('startedAt'),
      render: (v: string) => dayjs(v).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: 'Ended',
      dataIndex: 'endedAt',
      sorter: sorterDate('endedAt'),
      render: (v: string) => dayjs(v).format('YYYY-MM-DD HH:mm'),
    },
  ];
}

export default function TripsPage(): React.ReactElement {
  const [licensePlate, setLicensePlate] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const query = buildQuery(licensePlate, startDate, endDate, page);
  const { result, loading, error, reload } = useTrips(query);
  const { vehicles } = useVehicles();

  const vehicleMap = useMemo(
    () => new Map(vehicles.map((v) => [v.id, v])),
    [vehicles],
  );

  const columns = useMemo(() => buildColumns(vehicleMap), [vehicleMap]);

  const handleFilterLicensePlate = (plate: string | undefined): void => {
    setLicensePlate(plate);
    setPage(1);
  };

  const handleStartDateChange = (date: Dayjs | null): void => {
    setStartDate(date);
    setPage(1);
  };

  const handleEndDateChange = (date: Dayjs | null): void => {
    setEndDate(date);
    setPage(1);
  };

  const handleCreated = (): void => {
    setModalOpen(false);
    reload();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 16, overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          flexShrink: 0,
        }}
      >
        <Typography.Title level={3} style={{ margin: 0 }}>
          Trips
        </Typography.Title>
        <Button type='primary' icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
          Record Trip
        </Button>
      </div>

      <div style={{ flexShrink: 0 }}>
        <TripFilters
          vehicles={vehicles}
          licensePlate={licensePlate}
          startDate={startDate}
          endDate={endDate}
          onLicensePlateChange={handleFilterLicensePlate}
          onStartDateChange={handleStartDateChange}
          onEndDateChange={handleEndDateChange}
        />
      </div>

      {error && <Alert type='error' message={error} showIcon style={{ flexShrink: 0 }} />}

      <div style={{ flex: 1, overflow: 'hidden', minHeight: 0 }}>
        <Table<TripResponseDto>
          rowKey='tripId'
          columns={columns}
          dataSource={result?.data ?? []}
          loading={loading}
          scroll={{ y: 'calc(100vh - 320px)', x: 'max-content' }}
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
      </div>

      <CreateTripModal
        open={modalOpen}
        vehicles={vehicles}
        onClose={() => setModalOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
}
