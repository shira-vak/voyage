import { useEffect, useState } from "react";
import type { VehicleSummaryDto } from "../../../api/generated";
import { VehiclesService } from "../../../api/generated";

type Params = {
  licensePlate: string | null;
  errorMessageFallback: string;
};

export function useVehicleSummary({
  licensePlate,
  errorMessageFallback,
}: Params) {
  const [summary, setSummary] = useState<VehicleSummaryDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!licensePlate) return;

    setLoading(true);
    setError(null);
    setSummary(null);

    VehiclesService.vehiclesControllerGetVehicleSummary({ licensePlate })
      .then(setSummary)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : errorMessageFallback),
      )
      .finally(() => setLoading(false));
  }, [licensePlate, errorMessageFallback]);

  return {
    summary,
    loading,
    error,
  };
}
