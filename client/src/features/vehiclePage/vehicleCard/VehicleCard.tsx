import { Card, Typography } from "antd";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import type { VehicleResponseDto } from "../../../api/generated";
import styles from "./styles.module.css";
import { VehicleTag } from "./VehicleTag";

interface VehicleCardProps {
  vehicle: VehicleResponseDto;
  onViewSummary: (licensePlate: string) => void;
}

export default function VehicleCard({
  vehicle,
  onViewSummary,
}: VehicleCardProps): React.ReactElement {
  const { t } = useTranslation();
  const { licensePlate, createdAt, name: vehicleName } = vehicle;

  return (
    <Card
      hoverable
      onClick={() => onViewSummary(licensePlate)}
      styles={{ body: { padding: "20px 24px" } }}
    >
      <div className={styles.header}>
        <div>
          <VehicleTag licensePlate={licensePlate} />
          <Typography.Text type="secondary" className={styles.vehicleName}>
            {vehicleName}
          </Typography.Text>
        </div>
        <Typography.Text type="secondary" className={styles.addedDate}>
          {t("vehicles.added", {
            date: dayjs(createdAt).format("MMM D, YYYY"),
          })}
        </Typography.Text>
      </div>
      <Typography.Text type="secondary" className={styles.hint}>
        {t("vehicles.viewSummaryHint")}
      </Typography.Text>
    </Card>
  );
}
