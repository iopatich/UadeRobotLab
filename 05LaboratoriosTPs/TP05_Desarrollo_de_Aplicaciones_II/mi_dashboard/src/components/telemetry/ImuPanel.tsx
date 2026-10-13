import { Axis3D } from "lucide-react";
import type { ImuHistorySample, ImuTelemetry } from "../../types/telemetry";
import { ImuChart } from "../../charts/ImuChart";
import { Panel } from "../ui/Panel";

interface ImuPanelProps {
  imu: ImuTelemetry;
  samples: ImuHistorySample[];
}

const metrics = [
  { key: "roll", label: "Roll", tone: "cyan" },
  { key: "pitch", label: "Pitch", tone: "amber" },
  { key: "yaw", label: "Yaw", tone: "violet" },
] as const;

export function ImuPanel({ imu, samples }: ImuPanelProps) {
  const visibleWindow = samples.length > 1
    ? samples[samples.length - 1].elapsedSeconds - samples[0].elapsedSeconds
    : 0;

  return (
    <Panel
      icon={Axis3D}
      title="Orientación · IMU"
      subtitle="Ángulos de Euler e historial"
      meta={<code>{samples.length} muestras · {visibleWindow.toFixed(1)} s</code>}
      className="imu-panel"
    >
      <div className="imu-metrics">
        {metrics.map(({ key, label, tone }) => (
          <div className="imu-metric" key={key}>
            <span>{label}</span>
            <strong className={`imu-metric__value imu-metric__value--${tone}`}>
              {imu[key].toFixed(1)}<small>°</small>
            </strong>
          </div>
        ))}
      </div>

      <ImuChart samples={samples} />

      <footer className="imu-panel__footer">
        <span>Ventana móvil basada en el timestamp de la API</span>
        <span className="imu-acceleration">
          Aceleración: X {imu.acceleration.x.toFixed(3)} · Y {imu.acceleration.y.toFixed(3)} · Z {imu.acceleration.z.toFixed(2)} m/s²
        </span>
      </footer>
    </Panel>
  );
}
