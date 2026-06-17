import { Alert } from "antd";
import { useState } from "react";
import CreateVehicleModal from "./createVehicleModal/CreateVehicleModal";
import { useVehicles } from "./hooks/useVehicles";
import styles from "./styles.module.css";
import VehicleSummaryDrawer from "./vehicleDrawer/VehicleSummaryDrawer";
import { VehiclesGrid } from "./vehiclesGrid/VehiclesGrid";
import { VehicleHeader } from "./VehicleHeader";

export default function VehiclesPage(): React.ReactElement {
  const { vehicles, loading, error, reload } = useVehicles();
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedLicensePlate, setSelectedLicensePlate] = useState<
    string | null
  >(null);

  const handleCreated = (): void => {
    setCreateOpen(false);
    reload();
  };

  return (
    <div className={styles.page}>
      <VehicleHeader setCreateOpen={setCreateOpen} />

      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          style={{ flexShrink: 0 }}
        />
      )}

      <VehiclesGrid
        vehicles={vehicles}
        loading={loading}
        error={error}
        setSelectedLicensePlate={setSelectedLicensePlate}
      />

      <CreateVehicleModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={handleCreated}
      />

      <VehicleSummaryDrawer
        licensePlate={selectedLicensePlate}
        onClose={() => setSelectedLicensePlate(null)}
      />
    </div>
  );
}
