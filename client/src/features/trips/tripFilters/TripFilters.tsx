import { DatePicker, Select, Space } from 'antd';
import type { Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';
import type { VehicleResponseDto } from '../../../api/generated';

interface TripFiltersProps {
  vehicles: VehicleResponseDto[];
  licensePlate: string | undefined;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onLicensePlateChange: (plate: string | undefined) => void;
  onStartDateChange: (date: Dayjs | null) => void;
  onEndDateChange: (date: Dayjs | null) => void;
}

const SELECT_MIN_WIDTH = 200;

export function TripFilters({
  vehicles,
  licensePlate,
  startDate,
  endDate,
  onLicensePlateChange,
  onStartDateChange,
  onEndDateChange,
}: TripFiltersProps): React.ReactElement {
  const { t } = useTranslation();

  const vehicleOptions = vehicles.map((v) => ({
    value: v.licensePlate,
    label: `${v.name} — ${v.licensePlate}`,
  }));

  return (
    <Space wrap>
      <Select
        allowClear
        placeholder={t('trips.filters.allVehicles')}
        value={licensePlate}
        onChange={onLicensePlateChange}
        style={{ minWidth: SELECT_MIN_WIDTH }}
        options={vehicleOptions}
      />

      <DatePicker
        value={startDate}
        onChange={onStartDateChange}
        format="YYYY-MM-DD"
        placeholder={t('trips.filters.fromDate')}
      />

      <DatePicker
        value={endDate}
        onChange={onEndDateChange}
        format="YYYY-MM-DD"
        placeholder={t('trips.filters.toDate')}
      />
    </Space>
  );
}
