/** Respuestas crudas documentadas en API.md. El futuro Adapter consume estos tipos. */
export type ApiRobotModel = "go2" | "g1";

export interface ApiMotorTelemetry {
  id: number;
  nombre: string;
  angulo: number;
  velocidad: number;
  torque: number;
  temperatura: number;
}

export interface ApiImuTelemetry {
  roll: number;
  pitch: number;
  yaw: number;
  ax: number;
  ay: number;
  az: number;
}

export interface ApiBmsTelemetry {
  soc: number;
  corriente: number;
  temperatura: number;
  celdas: number[];
}

export interface ApiTelemetryResponse {
  modelo: ApiRobotModel;
  ts: number;
  motores: ApiMotorTelemetry[];
  imu: ApiImuTelemetry;
  bms: ApiBmsTelemetry;
  fuerzas: Record<string, 0 | 1>;
}

export interface ApiRobotInfoResponse {
  modelo: ApiRobotModel;
  nombre: string;
  tipo: "cuadrupedo" | "humanoide";
  n_motores: number;
  motores_nombres: string[];
  patas: string[];
  frecuencia_hz: number;
  modo: "demo" | "simulador" | string;
}
