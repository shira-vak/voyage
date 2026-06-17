import { Empty } from "antd";
import { useTranslation } from "react-i18next";
import { ExistingVehicleGrid } from "./ExistingVehicleGrid";
import { SkeletonVehiclesGrid } from "./SkeletonVehicleGrid";
import styles from "./styles.module.css";

interface VehiclesGridProps {
  vehicles: any[];
  loading: boolean;
  setSelectedLicensePlate: (licensePlate: string | null) => void;
}

export const VehiclesGrid = ({
  vehicles,
  loading,
  setSelectedLicensePlate,
}: VehiclesGridProps) => {
  const { t } = useTranslation();

  return (
    <div className={styles.grid}>
      {loading && (
        <SkeletonVehiclesGrid skeletonCount={vehicles.length ?? undefined} />
      )}

      {!loading && vehicles.length === 0 && (
        <Empty description={t("vehicles.noVehicles")} />
      )}

      {!loading && vehicles.length > 0 && (
        <ExistingVehicleGrid
          vehicles={vehicles}
          onViewSummary={setSelectedLicensePlate}
        />
      )}
    </div>
  );
};
