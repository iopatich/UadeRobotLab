import { useCallback, useEffect, useRef, useState } from "react";
import {
  connectTelemetrySocket,
  fetchRobotInfo,
  type ConnectionStatus,
  type TelemetrySocket,
} from "../services/telemetryClient";
import { appendCapture, type CapturedSample } from "../features/capture/captureSession";
import { downloadCsv } from "../features/export/csvExport";
import type {
  ConnectionState,
  ImuHistorySample,
  RobotInfo,
  TelemetrySnapshot,
} from "../types/telemetry";

const MAX_IMU_HISTORY = 300;

export interface TelemetrySession {
  connectionState: ConnectionState;
  robotInfo: RobotInfo | null;
  snapshot: TelemetrySnapshot | null;
  imuHistory: ImuHistorySample[];
  captures: CapturedSample[];
  lastError: string | null;
  captureSample: () => void;
  exportCsv: () => void;
  retry: () => void;
}

export function useTelemetry(): TelemetrySession {
  const [connectionState, setConnectionState] = useState<ConnectionState>("connecting");
  const [robotInfo, setRobotInfo] = useState<RobotInfo | null>(null);
  const [snapshot, setSnapshot] = useState<TelemetrySnapshot | null>(null);
  const [imuHistory, setImuHistory] = useState<ImuHistorySample[]>([]);
  const [captures, setCaptures] = useState<CapturedSample[]>([]);
  const [lastError, setLastError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const snapshotRef = useRef<TelemetrySnapshot | null>(null);

  useEffect(() => {
    let disposed = false;
    let socket: TelemetrySocket | null = null;

    setConnectionState("connecting");
    setRobotInfo(null);
    setSnapshot(null);
    snapshotRef.current = null;
    setImuHistory([]);

    fetchRobotInfo()
      .then((info) => {
        if (disposed) return;
        setRobotInfo(info);
        setLastError(null);
        socket = connectTelemetrySocket({
          onStatus: (status: ConnectionStatus) => {
            if (!disposed) setConnectionState(status);
          },
          onSnapshot: (next) => {
            if (disposed) return;
            snapshotRef.current = next;
            setSnapshot(next);
            setImuHistory((history) =>
              [...history, { elapsedSeconds: next.elapsedSeconds, roll: next.imu.roll, pitch: next.imu.pitch, yaw: next.imu.yaw }]
                .slice(-MAX_IMU_HISTORY),
            );
          },
        });
      })
      .catch((error: unknown) => {
        if (disposed) return;
        setConnectionState("disconnected");
        setLastError(error instanceof Error ? error.message : "No se pudo contactar al backend");
      });

    return () => {
      disposed = true;
      socket?.close();
    };
  }, [attempt]);

  const captureSample = useCallback(() => {
    const current = snapshotRef.current;
    if (!current) return;
    setCaptures((samples) => appendCapture(samples, current));
  }, []);

  const exportCsv = useCallback(() => {
    setCaptures((samples) => {
      downloadCsv(samples);
      return samples;
    });
  }, []);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return {
    connectionState,
    robotInfo,
    snapshot,
    imuHistory,
    captures,
    lastError,
    captureSample,
    exportCsv,
    retry,
  };
}
