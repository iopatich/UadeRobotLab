import type {
  ApiBmsTelemetry,
  ApiImuTelemetry,
  ApiRobotInfoResponse,
  ApiTelemetryResponse,
} from "../types/api";
import type {
  BatteryTelemetry,
  ImuTelemetry,
  MotorTelemetry,
  RobotInfo,
  RobotKind,
  TelemetrySnapshot,
} from "../types/telemetry";

const num = (value: unknown): number => {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
};

export function adaptRobotInfo(info: ApiRobotInfoResponse): RobotInfo {
  const kind: RobotKind = info.tipo === "cuadrupedo" ? "quadruped" : "humanoid";
  return {
    model: info.modelo,
    displayName: info.nombre,
    kind,
    motorCount: info.n_motores,
    contactLabels: info.patas ?? [],
    updateRateHz: info.frecuencia_hz,
    mode: info.modo,
  };
}

function adaptImu(imu: ApiImuTelemetry | undefined): ImuTelemetry {
  return {
    roll: num(imu?.roll),
    pitch: num(imu?.pitch),
    yaw: num(imu?.yaw),
    acceleration: { x: num(imu?.ax), y: num(imu?.ay), z: num(imu?.az) },
  };
}

function adaptBattery(bms: ApiBmsTelemetry | undefined): BatteryTelemetry {
  return {
    stateOfCharge: num(bms?.soc),
    currentMilliampere: num(bms?.corriente),
    temperatureCelsius: num(bms?.temperatura),
    cellVoltages: (bms?.celdas ?? []).map(num),
  };
}

export function adaptTelemetry(data: ApiTelemetryResponse): TelemetrySnapshot {
  const motors: MotorTelemetry[] = (data.motores ?? []).map((motor) => ({
    id: motor.id,
    name: motor.nombre,
    angleDegrees: num(motor.angulo),
    velocityRadiansPerSecond: num(motor.velocidad),
    estimatedTorqueNm: num(motor.torque),
    temperatureCelsius: num(motor.temperatura),
  }));

  const contacts: Record<string, boolean> = {};
  for (const [label, force] of Object.entries(data.fuerzas ?? {})) {
    contacts[label] = force === 1;
  }

  return {
    model: data.modelo,
    elapsedSeconds: num(data.ts),
    motors,
    imu: adaptImu(data.imu),
    battery: adaptBattery(data.bms),
    contacts,
  };
}
