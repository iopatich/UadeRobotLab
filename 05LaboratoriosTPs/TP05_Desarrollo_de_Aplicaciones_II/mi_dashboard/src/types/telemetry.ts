export type RobotModel = "go2" | "g1";
export type RobotKind = "quadruped" | "humanoid";
export type ConnectionState =
  | "fixture"
  | "connecting"
  | "connected"
  | "reconnecting"
  | "disconnected";

export interface MotorTelemetry {
  id: number;
  name: string;
  angleDegrees: number;
  velocityRadiansPerSecond: number;
  estimatedTorqueNm: number;
  temperatureCelsius: number;
}

export interface ImuTelemetry {
  roll: number;
  pitch: number;
  yaw: number;
  acceleration: {
    x: number;
    y: number;
    z: number;
  };
}

export interface BatteryTelemetry {
  stateOfCharge: number;
  currentMilliampere: number;
  temperatureCelsius: number;
  cellVoltages: number[];
}

export interface TelemetrySnapshot {
  model: RobotModel;
  elapsedSeconds: number;
  motors: MotorTelemetry[];
  imu: ImuTelemetry;
  battery: BatteryTelemetry;
  contacts: Record<string, boolean>;
}

export interface ImuHistorySample {
  elapsedSeconds: number;
  roll: number;
  pitch: number;
  yaw: number;
}

export interface RobotInfo {
  model: RobotModel;
  displayName: string;
  kind: RobotKind;
  motorCount: number;
  contactLabels: string[];
  updateRateHz: number;
  mode: string;
}
