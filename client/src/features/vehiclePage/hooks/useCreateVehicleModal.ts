import { App } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { VehiclesService } from "../../../api/generated";
import { extractErrorMessage } from "../../utils";
import { VehicleFormValues } from "../types";

type Params = {
  form: any;
  onCreated: () => void;
  onClose: () => void;
};

export function useCreateVehicleModal({ form, onCreated, onClose }: Params) {
  const { t } = useTranslation();
  const { message } = App.useApp();
  const [submitting, setSubmitting] = useState(false);

  const submit = async (): Promise<void> => {
    const values: VehicleFormValues = await form.validateFields();

    setSubmitting(true);
    try {
      await VehiclesService.vehiclesControllerCreateVehicle({
        requestBody: values,
      });

      void message.success(t("vehicles.modal.success", { name: values.name }));

      form.resetFields();
      onCreated();
    } catch (err) {
      void message.error(
        extractErrorMessage(err, t("vehicles.modal.errorFallback")),
      );
    } finally {
      setSubmitting(false);
    }
  };

  const close = (): void => {
    form.resetFields();
    onClose();
  };

  return {
    submitting,
    submit,
    close,
  };
}
