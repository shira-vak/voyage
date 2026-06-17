import { App, Form, Input, Modal } from 'antd';
import { useState } from 'react';
import { vehiclesApi } from '../../api/vehicles';

interface FormValues {
  name: string;
  licensePlate: string;
}

interface CreateVehicleModalProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateVehicleModal({
  open,
  onClose,
  onCreated,
}: CreateVehicleModalProps): React.ReactElement {
  const { message } = App.useApp();
  const [form] = Form.useForm<FormValues>();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (): Promise<void> => {
    const values = await form.validateFields();
    setSubmitting(true);
    try {
      await vehiclesApi.create(values);
      void message.success(`Vehicle "${values.name}" added`);
      form.resetFields();
      onCreated();
    } catch (err) {
      void message.error(err instanceof Error ? err.message : 'Failed to create vehicle');
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
      title='Add Vehicle'
      open={open}
      onOk={handleSubmit}
      onCancel={handleClose}
      okText='Add Vehicle'
      confirmLoading={submitting}
      destroyOnClose
    >
      <Form form={form} layout='vertical' style={{ marginTop: 16 }}>
        <Form.Item
          name='name'
          label='Vehicle Name'
          rules={[{ required: true, message: 'Enter a vehicle name' }]}
        >
          <Input placeholder='e.g. Israel Express' />
        </Form.Item>

        <Form.Item
          name='licensePlate'
          label='Licence Plate'
          rules={[{ required: true, message: 'Enter a licence plate' }]}
        >
          <Input placeholder='e.g. IL-EX-001' />
        </Form.Item>
      </Form>
    </Modal>
  );
}
