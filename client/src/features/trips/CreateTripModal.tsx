import { App, DatePicker, Form, InputNumber, Modal, Select } from 'antd';
import type { Dayjs } from 'dayjs';
import { useState } from 'react';
import { tripsApi } from '../../api/trips';
import type { VehicleResponse } from '../../api/types';

interface FormValues {
  vehicleId: string;
  dateRange: [Dayjs, Dayjs];
  distanceKm: number;
  fuelConsumed: number;
}

interface CreateTripModalProps {
  open: boolean;
  vehicles: VehicleResponse[];
  preselectedVehicleId?: string;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateTripModal({
  open,
  vehicles,
  preselectedVehicleId,
  onClose,
  onCreated,
}: CreateTripModalProps): React.ReactElement {
  const { message } = App.useApp();
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (): Promise<void> => {
    const values = await form.validateFields();
    setSubmitting(true);
    try {
      await tripsApi.create(values.vehicleId, {
        startedAt: values.dateRange[0].toISOString(),
        endedAt: values.dateRange[1].toISOString(),
        distanceKm: values.distanceKm,
        fuelConsumed: values.fuelConsumed,
      });
      void message.success('Trip recorded successfully');
      form.resetFields();
      onCreated();
    } catch (err) {
      void message.error(err instanceof Error ? err.message : 'Failed to record trip');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = (): void => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title='Record New Trip'
      open={open}
      onOk={handleSubmit}
      onCancel={handleClose}
      okText='Record Trip'
      confirmLoading={submitting}
      destroyOnClose
    >
      <Form
        form={form}
        layout='vertical'
        style={{ marginTop: 16 }}
        initialValues={{ vehicleId: preselectedVehicleId }}
      >
        <Form.Item name='vehicleId' label='Vehicle' rules={[{ required: true, message: 'Select a vehicle' }]}>
          <Select
            placeholder='Select vehicle'
            options={vehicles.map((v) => ({ value: v.id, label: `${v.name} — ${v.licensePlate}` }))}
          />
        </Form.Item>

        <Form.Item
          name='dateRange'
          label='Start & End Time'
          rules={[{ required: true, message: 'Select start and end time' }]}
        >
          <DatePicker.RangePicker showTime format='YYYY-MM-DD HH:mm' style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name='distanceKm'
          label='Distance (km)'
          rules={[{ required: true, message: 'Enter distance' }]}
        >
          <InputNumber min={0.01} precision={2} style={{ width: '100%' }} placeholder='e.g. 145.5' />
        </Form.Item>

        <Form.Item
          name='fuelConsumed'
          label='Fuel / Energy Consumed (L or kWh)'
          rules={[{ required: true, message: 'Enter fuel consumed' }]}
        >
          <InputNumber min={0.01} precision={2} style={{ width: '100%' }} placeholder='e.g. 18.3' />
        </Form.Item>
      </Form>
    </Modal>
  );
}
