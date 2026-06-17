import { DatePicker, Select, Space } from 'antd';
import type { Dayjs } from 'dayjs';
import type { VehicleResponseDto } from '../../api/generated';

interface TripFiltersProps {
  vehicles: VehicleResponseDto[];
  licensePlate: string | undefined;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
  onLicensePlateChange: (plate: string | undefined) => void;
  onStartDateChange: (date: Dayjs | null) => void;
  onEndDateChange: (date: Dayjs | null) => void;
}

export default function TripFilters({
  vehicles,
  licensePlate,
  startDate,
  endDate,
  onLicensePlateChange,
  onStartDateChange,
  onEndDateChange,
}: TripFiltersProps): React.ReactElement {
  return (
    <Space wrap>
      <Select
        allowClear
        placeholder='All vehicles'
        value={licensePlate}
        onChange={onLicensePlateChange}
        style={{ minWidth: 200 }}
        options={vehicles.map((v) => ({ value: v.licensePlate, label: `${v.name} — ${v.licensePlate}` }))}
      />

      <DatePicker
        value={startDate}
        onChange={onStartDateChange}
        format='YYYY-MM-DD'
        placeholder='From date'
      />

      <DatePicker
        value={endDate}
        onChange={onEndDateChange}
        format='YYYY-MM-DD'
        placeholder='To date'
      />
    </Space>
  );
}
