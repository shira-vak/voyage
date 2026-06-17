import { DatePicker, Select, Space } from 'antd';
import type { Dayjs } from 'dayjs';
import type { VehicleResponseDto } from '../../api/generated';

interface TripFiltersProps {
  vehicles: VehicleResponseDto[];
  licensePlate: string | undefined;
  dateRange: [Dayjs, Dayjs] | null;
  onLicensePlateChange: (plate: string | undefined) => void;
  onDateRangeChange: (range: [Dayjs, Dayjs] | null) => void;
}

export default function TripFilters({
  vehicles,
  licensePlate,
  dateRange,
  onLicensePlateChange,
  onDateRangeChange,
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

      <DatePicker.RangePicker
        value={dateRange}
        onChange={(val) => onDateRangeChange(val as [Dayjs, Dayjs] | null)}
        format='YYYY-MM-DD'
        placeholder={['Start date', 'End date']}
      />
    </Space>
  );
}
