import { useCallback, useEffect, useState } from 'react';
import { vehiclesApi } from '../../api/vehicles';
import type { VehicleResponse } from '../../api/types';

interface UseVehiclesResult {
  vehicles: VehicleResponse[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useVehicles(): UseVehiclesResult {
  const [vehicles, setVehicles] = useState<VehicleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await vehiclesApi.list();
      setVehicles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load vehicles');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void load(); }, [load]);

  return { vehicles, loading, error, reload: load };
}
