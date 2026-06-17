import { useMemo, useState } from "react";
import { useVehicles } from "../vehiclePage/hooks/useVehicles";
import CreateTripModal from "./createTripModal/CreateTripModal";
import { useTrips } from "./hooks/useTrips";
import { useTripsFilters } from "./hooks/useTripsFilters";
import styles from "./styles.module.css";
import { TripFilters } from "./tripFilters/TripFilters";
import { TripsHeader } from "./TripsHeader";
import { TripsTable } from "./tripsTable/TripsTable";

export default function TripsPage(): React.ReactElement {
  const [modalOpen, setModalOpen] = useState(false);

  const {
    filters,
    page,
    query,
    onPageChange,
    onLicensePlateChange,
    onStartDateChange,
    onEndDateChange,
  } = useTripsFilters();
  const { result, loading, reload } = useTrips(query);
  const { vehicles } = useVehicles();

  const vehicleMap = useMemo(
    () => new Map(vehicles.map((v) => [v.id, v])),
    [vehicles],
  );

  return (
    <div className={styles.page}>
      <TripsHeader onAddTrip={() => setModalOpen(true)} />

      <div className={styles.filters}>
        <TripFilters
          vehicles={vehicles}
          {...filters}
          onLicensePlateChange={onLicensePlateChange}
          onStartDateChange={onStartDateChange}
          onEndDateChange={onEndDateChange}
        />
      </div>

      <TripsTable
        result={result}
        loading={loading}
        vehicleMap={vehicleMap}
        page={page}
        onPageChange={onPageChange}
      />

      <CreateTripModal
        open={modalOpen}
        vehicles={vehicles}
        onClose={() => setModalOpen(false)}
        onCreated={() => {
          setModalOpen(false);
          reload();
        }}
      />
    </div>
  );
}
