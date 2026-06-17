import { ApiError } from "../api/generated";

export const CUSTOM_UNREACHABLE_SERVER_EVENT = "app:server-unreachable";

export function extractErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof TypeError && err.message === "Failed to fetch") {
    window.dispatchEvent(new CustomEvent(CUSTOM_UNREACHABLE_SERVER_EVENT));
    return fallback;
  }
  if (err instanceof ApiError) {
    const body = err.body as { message?: string | string[] } | null;
    const msg =
      typeof body === "object" && body !== null ? body.message : undefined;

    if (err.status >= 500 && !msg) {
      window.dispatchEvent(new CustomEvent(CUSTOM_UNREACHABLE_SERVER_EVENT));
      return fallback;
    }

    if (Array.isArray(msg)) return msg.join(", ");
    if (typeof msg === "string") return msg;

    return fallback;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}
