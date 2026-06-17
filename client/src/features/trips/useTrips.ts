import { useCallback, useEffect, useState } from 'react';
import { tripsApi } from '../../api/trips';
import type { ListTripsQuery, PaginatedTripsResponse } from '../../api/types';

interface UseTripsResult {
  result: PaginatedTripsResponse | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useTrips(query: ListTripsQuery): UseTripsResult {
  const [result, setResult] = useState<PaginatedTripsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await tripsApi.list(query);
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
