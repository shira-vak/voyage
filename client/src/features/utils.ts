import { ApiError } from "../api/generated";

export const CUSTOM_UNREACHABLE_SERVER_EVENT = "app:server-unreachable";

export function extractErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof TypeError && err.message === "Failed to fetch") {
    window.dispatchEvent(new CustomEvent(CUSTOM_UNREACHABLE_SERVER_EVENT));
    return fallback;
  }
  if (err instanceof ApiError) {
    const body = err.body as { message?: string | string[] } | null;
    if (err.status >= 500 && !body?.message) {
      window.dispatchEvent(new CustomEvent(CUSTOM_UNREACHABLE_SERVER_EVENT));
      return fallback;
    }

    const msg = body?.message;

    if (Array.isArray(msg)) return msg.join(", ");
    if (typeof msg === "string") return msg;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}
