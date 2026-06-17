import { PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Empty, Row, Skeleton, Tag, Typography } from 'antd';
import dayjs from 'dayjs';
import { useState } from 'react';
import type { VehicleResponseDto } from '../../api/generated';
import CreateVehicleModal from './CreateVehicleModal';
import VehicleSummaryDrawer from './VehicleSummaryDrawer';
import { useVehicles } from './useVehicles';

function VehicleCard({
  vehicle,
  onViewSummary,
}: {
  vehicle: VehicleResponseDto;
  onViewSummary: (id: string) => void;
}): React.ReactElement {
  return (
    <Card
      hoverable
      onClick={() => onViewSummary(vehicle.licensePlate)}
      styles={{ body: { padding: '20px 24px' } }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <Typography.Text strong style={{ fontSize: 16 }}>
            {vehicle.name}
          </Typography.Text>
          <div style={{ marginTop: 4 }}>
            <Tag color='green'>{vehicle.licensePlate}</Tag>
          </div>
        </div>
        <Typography.Text type='secondary' style={{ fontSize: 12 }}>
          Added {dayjs(vehicle.createdAt).format('MMM D, YYYY')}
        </Typography.Text>
      </div>
      <Typography.Text type='secondary' style={{ fontSize: 12, marginTop: 12, display: 'block' }}>
        Click to view trip summary →
      </Typography.Text>
    </Card>
  );
}

export default function VehiclesPage(): React.ReactElement {
  const { vehicles, loading, error, reload } = useVehicles();
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedLicensePlate, setSelectedLicensePlate] = useState<string | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <Typography.Title level={3} style={{ margin: 0 }}>
          Vehicles
        </Typography.Title>
        <Button type='primary' icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
          Add Vehicle
        </Button>
      </div>

      {error && <Alert type='error' message={error} showIcon />}

      {loading && (
        <Row gutter={[16, 16]}>
          {[1, 2, 3].map((n) => (
            <Col key={n} xs={24} sm={12} md={8}>
              <Card>
                <Skeleton active />
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {!loading && vehicles.length === 0 && !error && (
        <Empty description='No vehicles yet. Add your first vehicle to get started.' />
      )}

      {!loading && vehicles.length > 0 && (
        <Row gutter={[16, 16]}>
          {vehicles.map((v) => (
            <Col key={v.id} xs={24} sm={12} md={8}>
              <VehicleCard vehicle={v} onViewSummary={setSelectedLicensePlate} />
            </Col>
          ))}
        </Row>
      )}

      <CreateVehicleModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => {
          setCreateOpen(false);
          reload();
        }}
      />

      <VehicleSummaryDrawer
        licensePlate={selectedLicensePlate}
        onClose={() => setSelectedLicensePlate(null)}
      />
    </div>
  );
}
