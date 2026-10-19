const DEFAULT_BASE_URL = "http://127.0.0.1:8001";

const raw = (import.meta as { env?: Record<string, string | undefined> }).env?.VITE_TELEMETRY_BASE_URL;

export const TELEMETRY_BASE_URL = (raw && raw.trim().length > 0 ? raw.trim() : DEFAULT_BASE_URL).replace(/\/+$/, "");

export function toWebSocketUrl(base: string = TELEMETRY_BASE_URL): string {
  return `${base.replace(/^http/, "ws")}/ws`;
}
