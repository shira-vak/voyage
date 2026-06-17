import { App } from 'antd';
import type { FormInstance } from 'antd';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TripsService } from '../../../api/generated';
import type { TripFormValues } from '../types';

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
      await TripsService.tripsControllerCreateTrip({
        licensePlate: values.licensePlate,
        requestBody: {
          startedAt: values.startedAt.toISOString(),
          endedAt: values.endedAt.toISOString(),
          distanceKm: values.distanceKm,
          fuelConsumed: values.fuelConsumed,
        },
      });
      void message.success(t('trips.modal.success'));
      form.resetFields();
      onCreated();
    } catch (err) {
      void message.error(err instanceof Error ? err.message : t('trips.modal.errorFallback'));
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
