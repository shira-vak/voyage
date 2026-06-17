import { Alert, Drawer, Skeleton } from "antd";
import { useTranslation } from "react-i18next";
import { useVehicleSummary } from "../hooks/useVehicleSummary";
import { VehicleSummaryDetails } from "./VehicleSummaryDetails";
import { VehicleSummaryDrawerHeader } from "./VehicleSummaryDrawerHeader";
import { VehicleSummaryStats } from "./VehicleSummaryStats";

const DRAWER_WIDTH = 420;

interface VehicleSummaryDrawerProps {
  licensePlate: string | null;
  onClose: () => void;
}

export default function VehicleSummaryDrawer({
  licensePlate,
  onClose,
}: VehicleSummaryDrawerProps): React.ReactElement {
  const { t } = useTranslation();

  const { summary, loading, error } = useVehicleSummary({
    licensePlate,
    errorMessageFallback: t("vehicles.summary.errorFallback"),
  });

  return (
    <Drawer
      title={
        <VehicleSummaryDrawerHeader
          title={summary?.vehicle.name ?? t("vehicles.summary.defaultTitle")}
        />
      }
      open={!!licensePlate}
      onClose={onClose}
      width={DRAWER_WIDTH}
    >
      {loading && <Skeleton active paragraph={{ rows: 6 }} />}

      {error && <Alert type="error" message={error} showIcon />}

      {summary && !loading && (
        <>
          <VehicleSummaryDetails summary={summary} />
          <VehicleSummaryStats summary={summary} />
        </>
      )}
    </Drawer>
  );
}
