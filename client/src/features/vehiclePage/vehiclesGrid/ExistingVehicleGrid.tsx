import { Col, Row } from "antd";
import { VehicleResponseDto } from "../../../api/generated";
import VehicleCard from "../vehicleCard/VehicleCard";
import { GRID_GUTTER, VEHICLE_COL_PROPS } from "./consts";

interface ExistingVehicleGridProps {
  vehicles: VehicleResponseDto[];
  onViewSummary: (licensePlate: string) => void;
}

export function ExistingVehicleGrid({
  vehicles,
  onViewSummary,
}: ExistingVehicleGridProps): React.ReactElement {
  return (
    <Row gutter={GRID_GUTTER}>
      {vehicles.map((v) => (
        <Col
          key={v.id}
          xs={VEHICLE_COL_PROPS.xs}
          sm={VEHICLE_COL_PROPS.sm}
          md={VEHICLE_COL_PROPS.md}
        >
          <VehicleCard vehicle={v} onViewSummary={onViewSummary} />
        </Col>
      ))}
    </Row>
  );
}
