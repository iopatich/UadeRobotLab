import { BatteryCharging } from "lucide-react";
import type { BatteryTelemetry } from "../../types/telemetry";
import { Panel } from "../ui/Panel";

interface BatteryPanelProps {
  battery: BatteryTelemetry;
}

const formatSignedNumber = (value: number): string => `${value > 0 ? "+" : ""}${value.toLocaleString("es-AR")}`;

export function BatteryPanel({ battery }: BatteryPanelProps) {
  const packVoltage = battery.cellVoltages.reduce((total, voltage) => total + voltage, 0);
  const voltageSpread = battery.cellVoltages.length
    ? (Math.max(...battery.cellVoltages) - Math.min(...battery.cellVoltages)) * 1000
    : 0;

  return (
    <Panel
      icon={BatteryCharging}
      title="Batería · BMS"
      subtitle="Carga, consumo y tensión por celda"
      meta={<code>{battery.cellVoltages.length} celdas</code>}
      className="battery-panel"
    >
      <div className="battery-overview">
        <div className="battery-charge">
          <span>Estado de carga</span>
          <strong>{battery.stateOfCharge}<small>%</small></strong>
          <div
            className="battery-progress"
            role="progressbar"
            aria-label="Estado de carga"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={battery.stateOfCharge}
          >
            <span style={{ width: `${Math.min(100, Math.max(0, battery.stateOfCharge))}%` }} />
          </div>
        </div>
        <div className="battery-metric">
          <span>Corriente</span>
          <strong>{formatSignedNumber(battery.currentMilliampere)}<small> mA</small></strong>
          <em>{battery.currentMilliampere < 0 ? "Descarga" : "Carga"}</em>
        </div>
        <div className="battery-metric">
          <span>Temperatura</span>
          <strong>{battery.temperatureCelsius.toFixed(1)}<small> °C</small></strong>
          <em>Dentro del rango</em>
        </div>
      </div>

      <div className="battery-cells-heading">
        <span>Voltajes individuales (V)</span>
        {battery.cellVoltages.length ? (
          <code>Pack {packVoltage.toFixed(3)} V · Δ {voltageSpread.toFixed(0)} mV</code>
        ) : null}
      </div>

      {battery.cellVoltages.length ? (
        <div className="battery-cells">
          {battery.cellVoltages.map((voltage, index) => (
            <div className="battery-cell" key={`${index}-${voltage}`}>
              <span>C{String(index + 1).padStart(2, "0")}</span>
              <strong>{voltage.toFixed(3)}</strong>
              <i aria-hidden="true" />
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <BatteryCharging size={20} aria-hidden="true" />
          <span>El robot no informó voltajes por celda en esta lectura.</span>
        </div>
      )}
    </Panel>
  );
}
