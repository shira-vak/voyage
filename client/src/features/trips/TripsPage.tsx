import { Alert } from 'antd';
import type { Dayjs } from 'dayjs';
import { useMemo, useState } from 'react';
import { useVehicles } from '../vehiclePage/hooks/useVehicles';
import CreateTripModal from './createTripModal/CreateTripModal';
import { useTrips } from './hooks/useTrips';
import styles from './styles.module.css';
import { TripFilters } from './tripFilters/TripFilters';
import { TripsHeader } from './TripsHeader';
import { TripsTable } from './tripsTable/TripsTable';
import { buildQuery } from './utils';

export default function TripsPage(): React.ReactElement {
  const [licensePlate, setLicensePlate] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  const query = buildQuery(licensePlate, startDate, endDate, page);
  const { result, loading, error, reload } = useTrips(query);
  const { vehicles } = useVehicles();

  const vehicleMap = useMemo(() => new Map(vehicles.map((v) => [v.id, v])), [vehicles]);

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
      <TripsHeader onAddTrip={() => setModalOpen(true)} />

      {error && (
        <Alert type="error" message={error} showIcon style={{ flexShrink: 0 }} />
      )}

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

      <TripsTable
        result={result}
        loading={loading}
        vehicleMap={vehicleMap}
        page={page}
        onPageChange={setPage}
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
