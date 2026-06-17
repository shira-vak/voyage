import { PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Table, Tag } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { TripResponseDto, VehicleResponseDto } from '../../api/generated';
import PageHeader from '../../components/PageHeader/PageHeader';
import { useVehicles } from '../vehicles/useVehicles';
import CreateTripModal from './CreateTripModal';
import TripFilters from './TripFilters';
import { DATETIME_FORMAT, DECIMAL_PRECISION, TRIPS_PAGE_SIZE } from './consts';
import styles from './styles.module.css';
import type { TripsQuery } from './types';
import { useTrips } from './useTrips';

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
    limit: TRIPS_PAGE_SIZE,
  };
}

function buildColumns(
  vehicleMap: Map<string, VehicleResponseDto>,
  t: (key: string) => string,
): ColumnsType<TripResponseDto> {
  const sorterNum = (key: keyof TripResponseDto) =>
    (a: TripResponseDto, b: TripResponseDto) => (a[key] as number) - (b[key] as number);

  const sorterDate = (key: keyof TripResponseDto) =>
    (a: TripResponseDto, b: TripResponseDto) =>
      new Date(a[key] as string).getTime() - new Date(b[key] as string).getTime();

  const vehicleNameCol: ColumnType<TripResponseDto> = {
    title: t('trips.columns.vehicleName'),
    key: 'vehicleName',
    sorter: (a, b) => {
      const nameA = vehicleMap.get(a.vehicleId)?.name ?? '';
      const nameB = vehicleMap.get(b.vehicleId)?.name ?? '';
      return nameA.localeCompare(nameB);
    },
    render: (_: unknown, row: TripResponseDto) => vehicleMap.get(row.vehicleId)?.name ?? '—',
  };

  const licensePlateCol: ColumnType<TripResponseDto> = {
    title: t('trips.columns.licensePlate'),
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
    vehicleNameCol,
    licensePlateCol,
    {
      title: t('trips.columns.duration'),
      dataIndex: 'durationMinutes',
      sorter: sorterNum('durationMinutes'),
      render: (v: number) => {
        const h = Math.floor(v / 60);
        const m = v % 60;
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
      },
    },
    {
      title: t('trips.columns.distanceKm'),
      dataIndex: 'distanceKm',
      sorter: sorterNum('distanceKm'),
      render: (v: number) => v.toFixed(1),
      align: 'right',
    },
    {
      title: t('trips.columns.fuel'),
      dataIndex: 'fuelConsumed',
      sorter: sorterNum('fuelConsumed'),
      render: (v: number) => `${v.toFixed(DECIMAL_PRECISION)} L`,
      align: 'right',
    },
    {
      title: t('trips.columns.efficiency'),
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
      title: t('trips.columns.started'),
      dataIndex: 'startedAt',
      sorter: sorterDate('startedAt'),
      render: (v: string) => dayjs(v).format(DATETIME_FORMAT),
    },
    {
      title: t('trips.columns.ended'),
      dataIndex: 'endedAt',
      sorter: sorterDate('endedAt'),
      render: (v: string) => dayjs(v).format(DATETIME_FORMAT),
    },
  ];
}

export default function TripsPage(): React.ReactElement {
  const { t } = useTranslation();
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

  const columns = useMemo(() => buildColumns(vehicleMap, t), [vehicleMap, t]);

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
    <div className={styles.page}>
      <PageHeader
        title={t('trips.title')}
        action={
          <Button type='primary' icon={<PlusOutlined />} onClick={() => setModalOpen(true)}>
            {t('trips.recordTrip')}
          </Button>
        }
      />

      <div className={styles.filters}>
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

      <div className={styles.tableWrapper}>
        <Table<TripResponseDto>
          rowKey='tripId'
          columns={columns}
          dataSource={result?.data ?? []}
          loading={loading}
          scroll={{ y: 'calc(100vh - 320px)', x: 'max-content' }}
          pagination={{
            current: page,
            pageSize: TRIPS_PAGE_SIZE,
            total: result?.totalTrips ?? 0,
            onChange: setPage,
            showSizeChanger: false,
            showTotal: (total) => t('trips.totalCount', { count: total }),
          }}
          locale={{ emptyText: t('trips.noTrips') }}
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
