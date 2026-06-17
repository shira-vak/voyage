import { useCallback, useEffect, useState } from 'react';
import type { PaginatedTripsDto } from '../../api/generated';
import { TripsService } from '../../api/generated';

interface TripsQuery {
  licensePlate?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

interface UseTripsResult {
  result: PaginatedTripsDto | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useTrips(query: TripsQuery): UseTripsResult {
  const [result, setResult] = useState<PaginatedTripsDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await TripsService.tripsControllerListTrips({
        licensePlate: query.licensePlate,
        startDate: query.startDate,
        endDate: query.endDate,
        page: query.page,
        limit: query.limit,
      });
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trips');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(query)]);

  useEffect(() => { void load(); }, [load]);

  return { result, loading, error, reload: load };
}
