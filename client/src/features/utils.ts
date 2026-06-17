import { ApiError } from "../api/generated";

export function extractErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError) {
    const msg = (err.body as { message?: string | string[] })?.message;
    if (Array.isArray(msg)) return msg.join(", ");
    if (typeof msg === "string") return msg;
  }
  if (err instanceof Error) return err.message;
  return fallback;
}
