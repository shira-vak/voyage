import { Table } from "antd";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type {
  PaginatedTripsDto,
  TripResponseDto,
  VehicleResponseDto,
} from "../../../api/generated";
import { TRIPS_PAGE_SIZE } from "../consts";
import styles from "./styles.module.css";
import { buildColumns } from "./buildColumns";

interface TripsTableProps {
  result: PaginatedTripsDto | null;
  loading: boolean;
  vehicleMap: Map<string, VehicleResponseDto>;
  page: number;
  onPageChange: (page: number) => void;
}

export function TripsTable({
  result,
  loading,
  vehicleMap,
  page,
  onPageChange,
}: TripsTableProps): React.ReactElement {
  const { t } = useTranslation();
  const columns = useMemo(() => buildColumns(vehicleMap, t), [vehicleMap, t]);

  return (
    <div className={styles.tableWrapper}>
      <Table<TripResponseDto>
        rowKey="tripId"
        columns={columns}
        dataSource={result?.data ?? []}
        loading={loading}
        scroll={{ y: "calc(100vh - 320px)", x: "max-content" }}
        pagination={{
          current: page,
          pageSize: TRIPS_PAGE_SIZE,
          total: result?.totalTrips ?? 0,
          onChange: onPageChange,
          showSizeChanger: false,
          showTotal: (total) => t("trips.totalCount", { count: total }),
        }}
        locale={{ emptyText: t("trips.noTrips") }}
        size="middle"
      />
    </div>
  );
}
