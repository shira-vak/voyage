import { Card, Col, Row, Skeleton } from "antd";
import { GRID_GUTTER, SKELETON_COUNT, VEHICLE_COL_PROPS } from "./consts";

interface SkeletonVehiclesGridProps {
  skeletonCount?: number;
}

export const SkeletonVehiclesGrid = ({
  skeletonCount = SKELETON_COUNT,
}: SkeletonVehiclesGridProps): React.ReactElement => {
  return (
    <Row gutter={GRID_GUTTER}>
      {Array.from({ length: skeletonCount }, (_, i) => (
        <Col
          key={i}
          xs={VEHICLE_COL_PROPS.xs}
          sm={VEHICLE_COL_PROPS.sm}
          md={VEHICLE_COL_PROPS.md}
        >
          <Card>
            <Skeleton active />
          </Card>
        </Col>
      ))}
    </Row>
  );
};
