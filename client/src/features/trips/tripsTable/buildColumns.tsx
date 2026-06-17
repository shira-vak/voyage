import { Tag } from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table";
import dayjs from "dayjs";
import type {
  TripResponseDto,
  VehicleResponseDto,
} from "../../../api/generated";
import { DATETIME_FORMAT, DECIMAL_PRECISION } from "../consts";
import { formatDuration } from "./utils";

export const buildColumns = (
  vehicleMap: Map<string, VehicleResponseDto>,
  t: (key: string) => string,
): ColumnsType<TripResponseDto> => {
  const sorterNum =
    (key: keyof TripResponseDto) => (a: TripResponseDto, b: TripResponseDto) =>
      (a[key] as number) - (b[key] as number);

  const sorterDate =
    (key: keyof TripResponseDto) => (a: TripResponseDto, b: TripResponseDto) =>
      new Date(a[key] as string).getTime() -
      new Date(b[key] as string).getTime();

  const vehicleNameCol: ColumnType<TripResponseDto> = {
    title: t("trips.columns.vehicleName"),
    key: "vehicleName",
    sorter: (a, b) => {
      const nameA = vehicleMap.get(a.vehicleId)?.name ?? "";
      const nameB = vehicleMap.get(b.vehicleId)?.name ?? "";
      return nameA.localeCompare(nameB);
    },
    render: (_: unknown, row: TripResponseDto) =>
      vehicleMap.get(row.vehicleId)?.name ?? "—",
  };

  const licensePlateCol: ColumnType<TripResponseDto> = {
    title: t("trips.columns.licensePlate"),
    key: "licensePlate",
    sorter: (a, b) => {
      const plateA = vehicleMap.get(a.vehicleId)?.licensePlate ?? "";
      const plateB = vehicleMap.get(b.vehicleId)?.licensePlate ?? "";
      return plateA.localeCompare(plateB);
    },
    render: (_: unknown, row: TripResponseDto) => {
      const plate = vehicleMap.get(row.vehicleId)?.licensePlate;
      return plate ? <Tag color="green">{plate}</Tag> : "—";
    },
  };

  return [
    vehicleNameCol,
    licensePlateCol,
    {
      title: t("trips.columns.duration"),
      dataIndex: "durationMinutes",
      sorter: sorterNum("durationMinutes"),
      render: (v: number) => formatDuration(v),
    },
    {
      title: t("trips.columns.distanceKm"),
      dataIndex: "distanceKm",
      sorter: sorterNum("distanceKm"),
      render: (v: number) => v.toFixed(1),
      align: "right",
    },
    {
      title: t("trips.columns.fuel"),
      dataIndex: "fuelConsumed",
      sorter: sorterNum("fuelConsumed"),
      render: (v: number) => `${v.toFixed(DECIMAL_PRECISION)} L`,
      align: "right",
    },
    {
      title: t("trips.columns.efficiency"),
      key: "efficiency",
      sorter: (a: TripResponseDto, b: TripResponseDto) =>
        a.distanceKm / a.fuelConsumed - b.distanceKm / b.fuelConsumed,
      render: (_: unknown, row: TripResponseDto) =>
        row.distanceKm > 0 ? (
          <Tag color="green">
            {(row.distanceKm / row.fuelConsumed).toFixed(1)} km/L
          </Tag>
        ) : (
          "—"
        ),
      align: "right",
    },
    {
      title: t("trips.columns.started"),
      dataIndex: "startedAt",
      sorter: sorterDate("startedAt"),
      render: (v: string) => dayjs(v).format(DATETIME_FORMAT),
    },
    {
      title: t("trips.columns.ended"),
      dataIndex: "endedAt",
      sorter: sorterDate("endedAt"),
      render: (v: string) => dayjs(v).format(DATETIME_FORMAT),
    },
  ];
};
