import { AlertTriangle, Cpu } from "lucide-react";
import type { MotorTelemetry } from "../../types/telemetry";
import {
  getTemperatureLabel,
  getTemperatureLevel,
  type TemperatureLevel,
} from "../../utils/temperature";
import { Panel } from "../ui/Panel";

interface MotorPanelProps {
  motors: MotorTelemetry[];
  expectedCount: number;
}

const MOTOR_PARTS: Record<string, string> = {
  hip: "Cadera",
  thigh: "Muslo",
  calf: "Pantorrilla",
};

const formatMotorName = (name: string) => {
  const [position = "—", joint = name] = name.split("_");
  return { position, joint: MOTOR_PARTS[joint] ?? joint.replaceAll("_", " ") };
};

export function MotorPanel({ motors, expectedCount }: MotorPanelProps) {
  const counts = motors.reduce<Record<TemperatureLevel, number>>(
    (accumulator, motor) => {
      accumulator[getTemperatureLevel(motor.temperatureCelsius)] += 1;
      return accumulator;
    },
    { normal: 0, warning: 0, critical: 0 },
  );

  const hottestMotor = motors.reduce<MotorTelemetry | null>((hottest, motor) => {
    if (!hottest || motor.temperatureCelsius > hottest.temperatureCelsius) return motor;
    return hottest;
  }, null);
  const hasCriticalMotor = hottestMotor && getTemperatureLevel(hottestMotor.temperatureCelsius) === "critical";

  return (
    <Panel
      icon={Cpu}
      title="Motores"
      subtitle="Estado térmico y cinemática por articulación"
      meta={<code>{motors.length} / {expectedCount}</code>}
      className="motor-panel"
    >
      <div className="motor-summary" aria-label="Resumen térmico">
        {(["normal", "warning", "critical"] as const).map((level) => (
          <span key={level} className={`temperature-summary temperature-summary--${level}`}>
            <span className="temperature-summary__dot" aria-hidden="true" />
            {counts[level]} {getTemperatureLabel(level).toLocaleLowerCase("es")}
          </span>
        ))}
      </div>

      {hasCriticalMotor ? (
        <div className="motor-alert" role="alert">
          <AlertTriangle size={16} aria-hidden="true" />
          <span>
            <strong>{hottestMotor.name}</strong> alcanzó {hottestMotor.temperatureCelsius.toFixed(1)} °C.
            Supera el umbral de 60 °C.
          </span>
          <code>DEMO</code>
        </div>
      ) : null}

      <div className="motor-table-wrap">
        <table className="motor-table">
          <thead>
            <tr>
              <th scope="col">Motor / articulación</th>
              <th scope="col">Temp. (°C)</th>
              <th scope="col">Ángulo (°)</th>
              <th scope="col">Vel. (rad/s)</th>
              <th scope="col">Torque (Nm)</th>
            </tr>
          </thead>
          <tbody>
            {motors.map((motor) => {
              const displayName = formatMotorName(motor.name);
              const level = getTemperatureLevel(motor.temperatureCelsius);
              return (
                <tr key={motor.id} className={level === "critical" ? "motor-table__row--critical" : undefined}>
                  <th scope="row">
                    <span className="motor-name">
                      <code>{displayName.position}</code>
                      <span>
                        {displayName.joint}
                        <small>{motor.name}</small>
                      </span>
                    </span>
                  </th>
                  <td>
                    <span className={`temperature-value temperature-value--${level}`}>
                      <span aria-hidden="true" />
                      {motor.temperatureCelsius.toFixed(1)} °C
                      <span className="sr-only">, estado {getTemperatureLabel(level)}</span>
                    </span>
                  </td>
                  <td>{motor.angleDegrees.toFixed(1)}</td>
                  <td>{motor.velocityRadiansPerSecond.toFixed(2)}</td>
                  <td>{motor.estimatedTorqueNm.toFixed(1)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <footer className="motor-panel__footer">
        <div className="temperature-legend" aria-label="Umbrales de temperatura">
          <span>Temperatura</span>
          <span className="temperature-summary temperature-summary--normal"><i /> &lt; 40 °C</span>
          <span className="temperature-summary temperature-summary--warning"><i /> 40–60 °C</span>
          <span className="temperature-summary temperature-summary--critical"><i /> &gt; 60 °C</span>
        </div>
        <span>Torque estimado · Datos simulados</span>
      </footer>
    </Panel>
  );
}
