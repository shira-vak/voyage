import { DatePicker, Form, InputNumber, Modal, Select } from "antd";
import { useTranslation } from "react-i18next";
import type { VehicleResponseDto } from "../../../api/generated";
import {
  DATETIME_FORMAT,
  DECIMAL_PRECISION,
  MIN_POSITIVE_VALUE,
} from "../consts";
import { useCreateTripModal } from "../hooks/useCreateTripModal";
import type { TripFormValues } from "../types";
import styles from "./styles.module.css";

interface CreateTripModalProps {
  open: boolean;
  vehicles: VehicleResponseDto[];
  preselectedLicensePlate?: string;
  onClose: () => void;
  onCreated: () => void;
}

export default function CreateTripModal({
  open,
  vehicles,
  preselectedLicensePlate,
  onClose,
  onCreated,
}: CreateTripModalProps): React.ReactElement {
  const { t } = useTranslation();
  const [form] = Form.useForm<TripFormValues>();

  const { submitting, submit, close } = useCreateTripModal({
    form,
    onCreated,
    onClose,
  });

  const vehicleOptions = vehicles.map((v) => ({
    value: v.licensePlate,
    label: `${v.name} — ${v.licensePlate}`,
  }));

  return (
    <Modal
      title={t("trips.modal.title")}
      open={open}
      onOk={submit}
      onCancel={close}
      okText={t("trips.modal.submit")}
      confirmLoading={submitting}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        className={styles.form}
        initialValues={{ licensePlate: preselectedLicensePlate }}
      >
        <Form.Item
          name="licensePlate"
          label={t("trips.modal.vehicle")}
          rules={[
            { required: true, message: t("trips.modal.validation.vehicle") },
          ]}
        >
          <Select
            placeholder={t("trips.modal.vehiclePlaceholder")}
            options={vehicleOptions}
          />
        </Form.Item>

        <Form.Item
          name="startedAt"
          label={t("trips.modal.startTime")}
          rules={[
            { required: true, message: t("trips.modal.validation.startTime") },
          ]}
        >
          <DatePicker
            showTime
            format={DATETIME_FORMAT}
            className={styles.fullWidth}
          />
        </Form.Item>

        <Form.Item
          name="endedAt"
          label={t("trips.modal.endTime")}
          rules={[
            { required: true, message: t("trips.modal.validation.endTime") },
          ]}
        >
          <DatePicker
            showTime
            format={DATETIME_FORMAT}
            className={styles.fullWidth}
          />
        </Form.Item>

        <Form.Item
          name="distanceKm"
          label={t("trips.modal.distanceKm")}
          rules={[
            { required: true, message: t("trips.modal.validation.distanceKm") },
          ]}
        >
          <InputNumber
            min={MIN_POSITIVE_VALUE}
            precision={DECIMAL_PRECISION}
            className={styles.fullWidth}
            placeholder={t("trips.modal.distancePlaceholder")}
          />
        </Form.Item>

        <Form.Item
          name="fuelConsumed"
          label={t("trips.modal.fuel")}
          rules={[
            { required: true, message: t("trips.modal.validation.fuel") },
          ]}
        >
          <InputNumber
            min={MIN_POSITIVE_VALUE}
            precision={DECIMAL_PRECISION}
            className={styles.fullWidth}
            placeholder={t("trips.modal.fuelPlaceholder")}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
