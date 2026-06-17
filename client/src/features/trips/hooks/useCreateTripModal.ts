import type { FormInstance } from "antd";
import { App } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TripsService } from "../../../api/generated";
import { extractErrorMessage } from "../../utils";
import type { TripFormValues } from "../types";

type Params = {
  form: FormInstance<TripFormValues>;
  onCreated: () => void;
  onClose: () => void;
};

export function useCreateTripModal({ form, onCreated, onClose }: Params) {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [submitting, setSubmitting] = useState(false);

  const submit = async (): Promise<void> => {
    const values = await form.validateFields();
    setSubmitting(true);
    try {
      const [startedAt, endedAt] = values.dateRange;
      await TripsService.tripsControllerCreateTrip({
        licensePlate: values.licensePlate,
        requestBody: {
          startedAt: startedAt.toISOString(),
          endedAt: endedAt.toISOString(),
          distanceKm: values.distanceKm,
          fuelConsumed: values.fuelConsumed,
        },
      });
      void message.success(t("trips.modal.success"));
      form.resetFields();
      onCreated();
    } catch (err) {
      void message.error(
        extractErrorMessage(err, t("trips.modal.errorFallback")),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const close = (): void => {
    form.resetFields();
    onClose();
  };

  return { submitting, submit, close };
}
