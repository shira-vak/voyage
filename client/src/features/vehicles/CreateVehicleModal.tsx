import { App, Form, Input, Modal } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { VehiclesService } from '../../api/generated';
import type { VehicleFormValues } from './types';

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
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [form] = Form.useForm<VehicleFormValues>();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (): Promise<void> => {
    const values = await form.validateFields();
    setSubmitting(true);
    try {
      await VehiclesService.vehiclesControllerCreateVehicle({ requestBody: values });
      void message.success(t('vehicles.modal.success', { name: values.name }));
      form.resetFields();
      onCreated();
    } catch (err) {
      void message.error(err instanceof Error ? err.message : t('vehicles.modal.errorFallback'));
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
      title={t('vehicles.modal.title')}
      open={open}
      onOk={handleSubmit}
      onCancel={handleClose}
      okText={t('vehicles.modal.submit')}
      confirmLoading={submitting}
      destroyOnClose
    >
      <Form form={form} layout='vertical' style={{ marginTop: 16 }}>
        <Form.Item
          name='name'
          label={t('vehicles.modal.name')}
          rules={[{ required: true, message: t('vehicles.modal.validation.name') }]}
        >
          <Input placeholder={t('vehicles.modal.namePlaceholder')} />
        </Form.Item>

        <Form.Item
          name='licensePlate'
          label={t('vehicles.modal.licensePlate')}
          rules={[{ required: true, message: t('vehicles.modal.validation.licensePlate') }]}
        >
          <Input placeholder={t('vehicles.modal.licensePlatePlaceholder')} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
