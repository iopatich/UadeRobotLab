import {
  connectTelemetrySocket,
  fetchRobotInfo,
} from "./telemetryClient";

/**
 * Punto de acceso unico a la telemetria del robot.
 *
 * El hook y los componentes no necesitan conocer URLs, fetch, WebSocket ni
 * la estrategia de reconexion: esos detalles permanecen encapsulados en el
 * cliente de telemetria.
 */
export const RobotTelemetryFacade = {
  getRobotInfo: fetchRobotInfo,
  connect: connectTelemetrySocket,
};
