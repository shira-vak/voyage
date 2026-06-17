import { DatePicker, Select, Space } from 'antd';
import type { Dayjs } from 'dayjs';
import type { VehicleResponse } from '../../api/types';

interface TripFiltersProps {
  vehicles: VehicleResponse[];
  vehicleId: string | undefined;
  dateRange: [Dayjs, Dayjs] | null;
  onVehicleChange: (id: string | undefined) => void;
  onDateRangeChange: (range: [Dayjs, Dayjs] | null) => void;
}

export default function TripFilters({
  vehicles,
  vehicleId,
  dateRange,
  onVehicleChange,
  onDateRangeChange,
}: TripFiltersProps): React.ReactElement {
  return (
    <Space wrap>
      <Select
        allowClear
        placeholder='All vehicles'
        value={vehicleId}
        onChange={onVehicleChange}
        style={{ minWidth: 200 }}
        options={vehicles.map((v) => ({ value: v.id, label: `${v.name} — ${v.licensePlate}` }))}
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
