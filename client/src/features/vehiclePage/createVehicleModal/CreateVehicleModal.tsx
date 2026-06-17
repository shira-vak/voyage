import { Form, Input, Modal } from "antd";
import { useTranslation } from "react-i18next";
import { VehicleFormValues } from "../types";
import { useCreateVehicleModal } from "../hooks/useCreateVehicleModal";

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
  const [form] = Form.useForm<VehicleFormValues>();

  const { submitting, submit, close } = useCreateVehicleModal({
    form,
    onCreated,
    onClose,
  });

  return (
    <Modal
      title={t("vehicles.modal.title")}
      open={open}
      onOk={submit}
      onCancel={close}
      okText={t("vehicles.modal.submit")}
      confirmLoading={submitting}
      destroyOnHidden
    >
      <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
        <Form.Item
          name="name"
          label={t("vehicles.modal.name")}
          rules={[
            { required: true, message: t("vehicles.modal.validation.name") },
          ]}
        >
          <Input placeholder={t("vehicles.modal.namePlaceholder")} />
        </Form.Item>

        <Form.Item
          name="licensePlate"
          label={t("vehicles.modal.licensePlate")}
          rules={[
            {
              required: true,
              message: t("vehicles.modal.validation.licensePlate"),
            },
          ]}
        >
          <Input placeholder={t("vehicles.modal.licensePlatePlaceholder")} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
