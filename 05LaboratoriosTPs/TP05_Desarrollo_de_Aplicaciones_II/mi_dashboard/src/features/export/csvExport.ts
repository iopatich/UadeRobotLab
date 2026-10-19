import type { CapturedSample } from "../capture/captureSession";

const CSV_SEPARATOR = ";";

const csvCell = (value: string | number): string => {
  const text = typeof value === "number" ? String(value) : value;
  return /[;"\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const toIsoLocal = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    ` ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  );
};

export function buildCsv(samples: CapturedSample[]): string {
  const header = [
    "captura_ts_local",
    "robot",
    "tiempo_api_s",
    "motor_id",
    "motor",
    "angulo_grados",
    "velocidad_rad_s",
    "torque_nm",
    "temperatura_c",
    "roll_grados",
    "pitch_grados",
    "yaw_grados",
    "soc_pct",
    "contactos",
  ];

  const rows: string[] = [header.join(CSV_SEPARATOR)];

  for (const sample of samples) {
    const { snapshot } = sample;
    const stamp = toIsoLocal(sample.capturedAt);
    const contacts = Object.entries(snapshot.contacts)
      .map(([label, down]) => `${label}:${down ? 1 : 0}`)
      .join(" ");

    for (const motor of snapshot.motors) {
      rows.push(
        [
          stamp,
          snapshot.model,
          snapshot.elapsedSeconds,
          motor.id,
          motor.name,
          motor.angleDegrees,
          motor.velocityRadiansPerSecond,
          motor.estimatedTorqueNm,
          motor.temperatureCelsius,
          snapshot.imu.roll,
          snapshot.imu.pitch,
          snapshot.imu.yaw,
          snapshot.battery.stateOfCharge,
          contacts,
        ].map(csvCell).join(CSV_SEPARATOR),
      );
    }
  }

  return rows.join("\r\n");
}

export function downloadCsv(samples: CapturedSample[]): void {
  if (samples.length === 0) return;
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const stamp = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  const model = samples[samples.length - 1].snapshot.model;

  const blob = new Blob([`\uFEFF${buildCsv(samples)}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `telemetria-${model}-${stamp}.csv`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}
