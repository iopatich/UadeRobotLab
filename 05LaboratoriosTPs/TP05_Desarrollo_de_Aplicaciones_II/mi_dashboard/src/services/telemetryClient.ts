import { TELEMETRY_BASE_URL, toWebSocketUrl } from "../config/env";
import { adaptRobotInfo, adaptTelemetry } from "../adapters/apiToTelemetry";
import type { ApiRobotInfoResponse, ApiTelemetryResponse } from "../types/api";
import type { RobotInfo, TelemetrySnapshot } from "../types/telemetry";

export type ConnectionStatus = "connecting" | "connected" | "reconnecting" | "disconnected";

export async function fetchRobotInfo(base: string = TELEMETRY_BASE_URL): Promise<RobotInfo> {
  const response = await fetch(`${base}/info`);
  if (!response.ok) {
    throw new Error(`GET /info falló con ${response.status}`);
  }
  return adaptRobotInfo((await response.json()) as ApiRobotInfoResponse);
}

export interface TelemetrySocket {
  close(): void;
}

const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_BASE_DELAY_MS = 600;

export function connectTelemetrySocket(options: {
  onSnapshot: (snapshot: TelemetrySnapshot) => void;
  onStatus: (status: ConnectionStatus) => void;
  base?: string;
}): TelemetrySocket {
  const base = options.base ?? TELEMETRY_BASE_URL;
  let socket: WebSocket | null = null;
  let closedByUser = false;
  let attempt = 0;
  let retryTimer: ReturnType<typeof setTimeout> | null = null;

  const open = () => {
    options.onStatus(attempt === 0 ? "connecting" : "reconnecting");
    socket = new WebSocket(toWebSocketUrl(base));

    socket.onopen = () => {
      attempt = 0;
      options.onStatus("connected");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(String(event.data)) as ApiTelemetryResponse;
        options.onSnapshot(adaptTelemetry(data));
      } catch {
        // mensaje ilegible: se descarta sin cortar la sesión
      }
    };

    socket.onclose = () => {
      if (closedByUser) return;
      attempt += 1;
      if (attempt >= MAX_RECONNECT_ATTEMPTS) {
        options.onStatus("disconnected");
        return;
      }
      options.onStatus("reconnecting");
      retryTimer = setTimeout(open, RECONNECT_BASE_DELAY_MS * attempt);
    };

    socket.onerror = () => {
      // onclose se encarga de la lógica de reintento
    };
  };

  open();

  return {
    close() {
      closedByUser = true;
      if (retryTimer) clearTimeout(retryTimer);
      socket?.close();
    },
  };
}
