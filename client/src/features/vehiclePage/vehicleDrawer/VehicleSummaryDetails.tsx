import { Descriptions, Typography } from "antd";
import { useTranslation } from "react-i18next";
import type { VehicleSummaryDto } from "../../../api/generated";

interface Props {
  summary: VehicleSummaryDto;
}

export function VehicleSummaryDetails({ summary }: Props): React.ReactElement {
  const { t } = useTranslation();

  return (
    <Descriptions column={1} size="small" bordered>
      <Descriptions.Item label={t("vehicles.summary.name")}>
        {summary.vehicle.name}
      </Descriptions.Item>

      <Descriptions.Item label={t("vehicles.summary.licencePlate")}>
        <Typography.Text code>{summary.vehicle.licensePlate}</Typography.Text>
      </Descriptions.Item>
    </Descriptions>
  );
}
