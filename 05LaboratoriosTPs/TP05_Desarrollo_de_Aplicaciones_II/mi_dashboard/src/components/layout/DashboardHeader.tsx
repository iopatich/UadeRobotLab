import { Activity, LayoutGrid, RotateCw } from "lucide-react";
import type { ConnectionState } from "../../types/telemetry";

interface DashboardHeaderProps {
  connectionState: ConnectionState;
  updateRateHz: number;
}

const CONNECTION_LABELS: Record<ConnectionState, string> = {
  fixture: "VISTA DEMO",
  connecting: "CONECTANDO",
  connected: "CONECTADO",
  reconnecting: "RECONECTANDO",
  disconnected: "SIN CONEXIÓN",
};

export function DashboardHeader({ connectionState, updateRateHz }: DashboardHeaderProps) {
  return (
    <header className="topbar">
      <a className="brand" href="#main-content" aria-label="Ir al monitor de telemetría">
        <span className="brand__mark" aria-hidden="true">
          <Activity size={23} strokeWidth={1.8} />
        </span>
        <span className="brand__name">Unitree<span>Lab</span></span>
      </a>

      <nav className="topbar__nav" aria-label="Navegación principal">
        <span className="topbar__nav-item topbar__nav-item--active">
          <LayoutGrid size={15} />
          Telemetría
        </span>
      </nav>

      <div className="topbar__status" aria-label="Estado de la aplicación">
        <span className={`connection-pill connection-pill--${connectionState}`}>
          <span className="connection-pill__dot" aria-hidden="true" />
          {CONNECTION_LABELS[connectionState]}
        </span>
        <span className="topbar__source">Datos de muestra</span>
        <span className="topbar__frequency" title="Frecuencia objetivo de la API">
          <RotateCw size={14} aria-hidden="true" />
          {updateRateHz} Hz
        </span>
      </div>
    </header>
  );
}
