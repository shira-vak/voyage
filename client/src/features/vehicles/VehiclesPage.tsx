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
          <div style={{ marginBottom: 4 }}>
            <Tag color='green' style={{ fontSize: 14, padding: '2px 8px' }}>{vehicle.licensePlate}</Tag>
          </div>
          <Typography.Text type='secondary' style={{ fontSize: 14 }}>
            {vehicle.name}
          </Typography.Text>
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 20, overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 12,
          flexShrink: 0,
        }}
      >
        <Typography.Title level={3} style={{ margin: 0 }}>
          Vehicles
        </Typography.Title>
        <Button type='primary' icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
          Add Vehicle
        </Button>
      </div>

      {error && <Alert type='error' message={error} showIcon style={{ flexShrink: 0 }} />}

      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
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
      </div>

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
