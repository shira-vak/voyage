import type { Dayjs } from 'dayjs';
import { useState } from 'react';
import type { TripsQuery } from '../types';
import { buildQuery } from '../utils';

interface TripsFilters {
  licensePlate: string | undefined;
  startDate: Dayjs | null;
  endDate: Dayjs | null;
}

interface UseTripsFiltersResult {
  filters: TripsFilters;
  page: number;
  query: TripsQuery;
  onPageChange: (page: number) => void;
  onLicensePlateChange: (plate: string | undefined) => void;
  onStartDateChange: (date: Dayjs | null) => void;
  onEndDateChange: (date: Dayjs | null) => void;
}

export function useTripsFilters(): UseTripsFiltersResult {
  const [licensePlate, setLicensePlate] = useState<string | undefined>(undefined);
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [page, setPage] = useState(1);

  const onLicensePlateChange = (plate: string | undefined): void => {
    setLicensePlate(plate);
    setPage(1);
  };

  const onStartDateChange = (date: Dayjs | null): void => {
    setStartDate(date);
    setPage(1);
  };

  const onEndDateChange = (date: Dayjs | null): void => {
    setEndDate(date);
    setPage(1);
  };

  return {
    filters: { licensePlate, startDate, endDate },
    page,
    query: buildQuery(licensePlate, startDate, endDate, page),
    onPageChange: setPage,
    onLicensePlateChange,
    onStartDateChange,
    onEndDateChange,
  };
}
