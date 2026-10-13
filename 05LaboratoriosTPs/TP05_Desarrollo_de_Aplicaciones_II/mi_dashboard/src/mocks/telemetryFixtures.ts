import type {
  ImuHistorySample,
  RobotInfo,
  TelemetrySnapshot,
} from "../types/telemetry";

export const go2RobotInfo: RobotInfo = {
  model: "go2",
  displayName: "Unitree Go2 EDU",
  kind: "quadruped",
  motorCount: 12,
  contactLabels: ["FR", "FL", "RR", "RL"],
  updateRateHz: 10,
  mode: "demo visual",
};

export const go2Telemetry: TelemetrySnapshot = {
  model: "go2",
  elapsedSeconds: 140.2,
  motors: [
    {
      id: 0,
      name: "FR_hip",
      angleDegrees: -4.2,
      velocityRadiansPerSecond: 0.12,
      estimatedTorqueNm: 1.8,
      temperatureCelsius: 36,
    },
    {
      id: 1,
      name: "FR_thigh",
      angleDegrees: 42.6,
      velocityRadiansPerSecond: -0.34,
      estimatedTorqueNm: 7.2,
      temperatureCelsius: 48,
    },
    {
      id: 2,
      name: "FR_calf",
      angleDegrees: -85.3,
      velocityRadiansPerSecond: 0.28,
      estimatedTorqueNm: -9.4,
      temperatureCelsius: 63,
    },
    {
      id: 3,
      name: "FL_hip",
      angleDegrees: 4,
      velocityRadiansPerSecond: -0.08,
      estimatedTorqueNm: -0.6,
      temperatureCelsius: 34,
    },
    {
      id: 4,
      name: "FL_thigh",
      angleDegrees: 56.1,
      velocityRadiansPerSecond: 1.24,
      estimatedTorqueNm: 2.1,
      temperatureCelsius: 38,
    },
    {
      id: 5,
      name: "FL_calf",
      angleDegrees: -104.7,
      velocityRadiansPerSecond: -1.68,
      estimatedTorqueNm: -2.8,
      temperatureCelsius: 41,
    },
    {
      id: 6,
      name: "RR_hip",
      angleDegrees: -3.8,
      velocityRadiansPerSecond: 0.06,
      estimatedTorqueNm: 0.5,
      temperatureCelsius: 35,
    },
    {
      id: 7,
      name: "RR_thigh",
      angleDegrees: 55.8,
      velocityRadiansPerSecond: 1.19,
      estimatedTorqueNm: 2,
      temperatureCelsius: 37,
    },
    {
      id: 8,
      name: "RR_calf",
      angleDegrees: -103.2,
      velocityRadiansPerSecond: -1.52,
      estimatedTorqueNm: -2.6,
      temperatureCelsius: 39,
    },
    {
      id: 9,
      name: "RL_hip",
      angleDegrees: 4.1,
      velocityRadiansPerSecond: -0.11,
      estimatedTorqueNm: -1.9,
      temperatureCelsius: 36,
    },
    {
      id: 10,
      name: "RL_thigh",
      angleDegrees: 43,
      velocityRadiansPerSecond: -0.31,
      estimatedTorqueNm: 7.6,
      temperatureCelsius: 46,
    },
    {
      id: 11,
      name: "RL_calf",
      angleDegrees: -86.1,
      velocityRadiansPerSecond: 0.25,
      estimatedTorqueNm: -9.8,
      temperatureCelsius: 38,
    },
  ],
  imu: {
    roll: 1.8,
    pitch: -2.4,
    yaw: 12.6,
    acceleration: { x: -0.043, y: -0.012, z: 9.79 },
  },
  battery: {
    stateOfCharge: 78,
    currentMilliampere: -3840,
    temperatureCelsius: 32.4,
    cellVoltages: [4.012, 4.008, 4.015, 4.011, 4.006, 4.013, 4.01, 4.014, 4.009, 4.012],
  },
  contacts: {
    FR: true,
    FL: false,
    RR: false,
    RL: true,
  },
};

const HISTORY_SIZE = 90;
const HISTORY_STEP_SECONDS = 0.1;

export const go2ImuHistory: ImuHistorySample[] = Array.from(
  { length: HISTORY_SIZE },
  (_, index) => {
    const time = go2Telemetry.elapsedSeconds - (HISTORY_SIZE - index - 1) * HISTORY_STEP_SECONDS;
    const progress = index / (HISTORY_SIZE - 1);

    return {
      elapsedSeconds: Number(time.toFixed(1)),
      roll: Number((4.8 + Math.sin(progress * Math.PI * 5.4) * 2.4 + Math.sin(index * 0.31) * 0.6).toFixed(2)),
      pitch: Number((-2.2 + Math.cos(progress * Math.PI * 5.7) * 2.1 + Math.sin(index * 0.27) * 0.45).toFixed(2)),
      yaw: Number((12.7 + Math.sin(progress * Math.PI * 5.1 + 0.9) * 1.6 + Math.cos(index * 0.33) * 0.35).toFixed(2)),
    };
  },
);

go2ImuHistory[go2ImuHistory.length - 1] = {
  elapsedSeconds: go2Telemetry.elapsedSeconds,
  roll: go2Telemetry.imu.roll,
  pitch: go2Telemetry.imu.pitch,
  yaw: go2Telemetry.imu.yaw,
};
