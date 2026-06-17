import {
  CarOutlined,
  ClockCircleOutlined,
  DashboardOutlined,
  FireOutlined,
} from "@ant-design/icons";
import { Statistic } from "antd";
import { useTranslation } from "react-i18next";
import type { VehicleSummaryDto } from "../../../api/generated";
import styles from "./styles.module.css";
import { formatDuration } from "./utils";

interface VehicleSummaryStatsProps {
  summary: VehicleSummaryDto;
}

export function VehicleSummaryStats({
  summary,
}: VehicleSummaryStatsProps): React.ReactElement {
  const { t } = useTranslation();

  return (
    <div className={styles.drawerStatsGrid}>
      <Statistic
        title={t("vehicles.summary.totalTrips")}
        value={summary.tripCount}
        prefix={<CarOutlined />}
      />

      <Statistic
        title={t("vehicles.summary.totalDistance")}
        value={summary.totalDistanceKm.toFixed(1)}
        suffix="km"
        prefix={<DashboardOutlined />}
      />

      <Statistic
        title={t("vehicles.summary.totalFuel")}
        value={summary.totalFuelConsumed.toFixed(2)}
        suffix="L"
        prefix={<FireOutlined />}
      />

      <Statistic
        title={t("vehicles.summary.avgDuration")}
        value={
          summary.tripCount > 0
            ? formatDuration(summary.averageDurationMinutes)
            : "—"
        }
        prefix={<ClockCircleOutlined />}
      />
    </div>
  );
}
