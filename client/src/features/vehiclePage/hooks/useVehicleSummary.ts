import { useEffect, useState } from "react";
import type { VehicleSummaryDto } from "../../../api/generated";
import { VehiclesService } from "../../../api/generated";
import { extractErrorMessage } from "../../utils";

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
        setError(extractErrorMessage(err, errorMessageFallback)),
      )
      .finally(() => setLoading(false));
  }, [licensePlate, errorMessageFallback]);

  return {
    summary,
    loading,
    error,
  };
}
