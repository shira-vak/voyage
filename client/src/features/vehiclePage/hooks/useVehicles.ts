import { useCallback, useEffect, useState } from "react";
import type { VehicleResponseDto } from "../../../api/generated";
import { VehiclesService } from "../../../api/generated";
import { extractErrorMessage } from "../../utils";

interface UseVehiclesResult {
  vehicles: VehicleResponseDto[];
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useVehicles(): UseVehiclesResult {
  const [vehicles, setVehicles] = useState<VehicleResponseDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      const data = await VehiclesService.vehiclesControllerListVehicles();
      setVehicles(data);
    } catch (err) {
      setError(extractErrorMessage(err, "Failed to load vehicles"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  return { vehicles, loading, error, reload: load };
}
