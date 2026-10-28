import type { TelemetrySnapshot } from "../../types/telemetry";

export interface CapturedSample {
  capturedAt: Date;
  sourceElapsedSeconds: number;
  snapshot: TelemetrySnapshot;
}

export function createCapturedSample(snapshot: TelemetrySnapshot): CapturedSample {
  return {
    capturedAt: new Date(),
    sourceElapsedSeconds: snapshot.elapsedSeconds,
    snapshot: structuredClone(snapshot),
  };
}

export function appendCapture(samples: CapturedSample[], snapshot: TelemetrySnapshot): CapturedSample[] {
  return [...samples, createCapturedSample(snapshot)];
}
