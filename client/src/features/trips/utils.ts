import type { Dayjs } from "dayjs";
import { TRIPS_PAGE_SIZE } from "./consts";
import type { TripsQuery } from "./types";

export const buildQuery = (
  licensePlate: string | undefined,
  startDate: Dayjs | null,
  endDate: Dayjs | null,
  page: number,
): TripsQuery => {
  return {
    ...(licensePlate && { licensePlate }),
    ...(startDate && { startDate: startDate.startOf("day").toISOString() }),
    ...(endDate && { endDate: endDate.endOf("day").toISOString() }),
    page,
    limit: TRIPS_PAGE_SIZE,
  };
};
