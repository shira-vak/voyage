import { PlusOutlined } from '@ant-design/icons';
import { Alert, Button, Card, Col, Empty, Row, Skeleton } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../../components/PageHeader/PageHeader';
import CreateVehicleModal from './CreateVehicleModal';
import VehicleCard from './VehicleCard';
import VehicleSummaryDrawer from './VehicleSummaryDrawer';
import styles from './styles.module.css';
import { useVehicles } from './useVehicles';

const SKELETON_COUNT = 3;

export default function VehiclesPage(): React.ReactElement {
  const { t } = useTranslation();
  const { vehicles, loading, error, reload } = useVehicles();
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedLicensePlate, setSelectedLicensePlate] = useState<string | null>(null);

  const handleCreated = (): void => {
    setCreateOpen(false);
    reload();
  };

  return (
    <div className={styles.page}>
      <PageHeader
        title={t('vehicles.title')}
        action={
          <Button type='primary' icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
            {t('vehicles.addVehicle')}
          </Button>
        }
      />

      {error && <Alert type='error' message={error} showIcon style={{ flexShrink: 0 }} />}

      <div className={styles.grid}>
        {loading && (
          <Row gutter={[16, 16]}>
            {Array.from({ length: SKELETON_COUNT }, (_, i) => (
              <Col key={i} xs={24} sm={12} md={8}>
                <Card>
                  <Skeleton active />
                </Card>
              </Col>
            ))}
          </Row>
        )}

        {!loading && vehicles.length === 0 && !error && (
          <Empty description={t('vehicles.noVehicles')} />
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
        onCreated={handleCreated}
      />

      <VehicleSummaryDrawer
        licensePlate={selectedLicensePlate}
        onClose={() => setSelectedLicensePlate(null)}
      />
    </div>
  );
}
