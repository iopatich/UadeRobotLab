import { CircleAlert, LoaderCircle, Radio, RotateCcw, Server, ShieldCheck } from "lucide-react";
import { TELEMETRY_BASE_URL } from "./config/env";
import { DashboardHeader } from "./components/layout/DashboardHeader";
import { SessionToolbar } from "./components/layout/SessionToolbar";
import { BatteryPanel } from "./components/telemetry/BatteryPanel";
import { ContactPanel } from "./components/telemetry/ContactPanel";
import { ImuPanel } from "./components/telemetry/ImuPanel";
import { MotorPanel } from "./components/telemetry/MotorPanel";
import { useTelemetry } from "./hooks/useTelemetry";

function ConnectionScreen({
  state,
  lastError,
  onRetry,
}: {
  state: "connecting" | "disconnected";
  lastError: string | null;
  onRetry: () => void;
}) {
  const isError = state === "disconnected";
  return (
    <div className={`connection-screen ${isError ? "connection-screen--error" : ""}`} role={isError ? "alert" : "status"}>
      {isError ? <CircleAlert size={22} aria-hidden="true" /> : <LoaderCircle size={22} aria-hidden="true" className="spin" />}
      <div>
        <strong>{isError ? "Sin conexión con el backend" : "Conectando al backend…"}</strong>
        <span>
          {isError
            ? lastError ?? `No se pudo contactar a ${TELEMETRY_BASE_URL}. ¿Está corriendo INICIAR_TP05?`
            : `Leyendo /info desde ${TELEMETRY_BASE_URL}`}
        </span>
      </div>
      {isError ? (
        <button type="button" onClick={onRetry}>
          <RotateCcw size={15} aria-hidden="true" />
          Reintentar
        </button>
      ) : null}
    </div>
  );
}

function StaleDataAlert({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="stale-data-alert" role="alert">
      <CircleAlert size={18} aria-hidden="true" />
      <div>
        <strong>Conexión perdida</strong>
        <span>Los valores mostrados corresponden a la última lectura recibida y pueden estar desactualizados.</span>
      </div>
      <button type="button" onClick={onRetry}>
        <RotateCcw size={14} aria-hidden="true" />
        Reintentar
      </button>
    </div>
  );
}

function App() {
  const {
    connectionState,
    robotInfo,
    snapshot,
    imuHistory,
    captures,
    lastError,
    captureSample,
    exportCsv,
    retry,
  } = useTelemetry();

  const waiting =
    connectionState === "disconnected" ? "disconnected" : "connecting";

  return (
    <div className="app-shell">
      <DashboardHeader
        connectionState={connectionState}
        updateRateHz={robotInfo?.updateRateHz ?? 0}
        sourceLabel={robotInfo ? `NODE · ${robotInfo.displayName}` : "BOOTING…"}
      />

      <main id="main-content" className="dashboard">
        <section className="dashboard-intro" aria-labelledby="dashboard-title">
          <div>
            <span className="eyebrow">[ UADE::DA-II / TP05 / SYSTEM CONSOLE ]</span>
            <h1 id="dashboard-title">TELEMETRY_OS</h1>
            <p>&gt; Supervisión de motores, orientación, batería y contacto para robots Unitree.</p>
            <code className="intro-status-line">BUILD: TP05 // MODE: OBSERVE // PROTOCOL: WS</code>
          </div>

          <div className="robot-context" aria-label="Contexto de datos">
            <div className="context-item">
              <span><Radio size={13} aria-hidden="true" /> Target node</span>
              <strong>{robotInfo?.displayName ?? "—"}</strong>
              <small>
                {robotInfo
                  ? `${robotInfo.motorCount} motores · ${robotInfo.kind === "quadruped" ? "Cuadrúpedo" : "Humanoide"}`
                  : "Esperando /info"}
              </small>
            </div>
            <div className="context-item">
              <span><Server size={13} aria-hidden="true" /> Data uplink</span>
              <strong>TP05 // BACKEND</strong>
              <small><code>{TELEMETRY_BASE_URL}</code></small>
            </div>
          </div>
        </section>

        {!robotInfo || !snapshot ? (
          <ConnectionScreen state={waiting} lastError={lastError} onRetry={retry} />
        ) : (
          <>
            <SessionToolbar
              sessionLabel={`NODE::${robotInfo.displayName} // LIVE`}
              sampleCount={imuHistory.length}
              elapsedSeconds={snapshot.elapsedSeconds}
              captureCount={captures.length}
              canCapture={connectionState === "connected"}
              onCapture={captureSample}
              onExportCsv={exportCsv}
            />

            {connectionState === "disconnected" ? (
              <StaleDataAlert onRetry={retry} />
            ) : null}

            <div className="dashboard-grid">
              <MotorPanel motors={snapshot.motors} expectedCount={robotInfo.motorCount} />

              <div className="dashboard-grid__secondary">
                <ImuPanel imu={snapshot.imu} samples={imuHistory} />
                <BatteryPanel battery={snapshot.battery} />
                <ContactPanel contacts={snapshot.contacts} robotKind={robotInfo.kind} />
              </div>
            </div>
          </>
        )}

        <footer className="dashboard-footer">
          <span>
            <ShieldCheck size={14} aria-hidden="true" />
            {robotInfo
              ? `Datos en vivo desde ${robotInfo.mode === "demo" ? "demo del backend" : robotInfo.mode}`
              : "Esperando al backend del TP05"}
          </span>
          <code>GET /info · WS /ws · {robotInfo?.updateRateHz ?? "—"} Hz</code>
        </footer>
      </main>
    </div>
  );
}

export default App;
