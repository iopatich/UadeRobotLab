import { Radio, Server, ShieldCheck } from "lucide-react";
import { DashboardHeader } from "./components/layout/DashboardHeader";
import { SessionToolbar } from "./components/layout/SessionToolbar";
import { BatteryPanel } from "./components/telemetry/BatteryPanel";
import { ContactPanel } from "./components/telemetry/ContactPanel";
import { ImuPanel } from "./components/telemetry/ImuPanel";
import { MotorPanel } from "./components/telemetry/MotorPanel";
import { go2ImuHistory, go2RobotInfo, go2Telemetry } from "./mocks/telemetryFixtures";

function App() {
  const telemetry = go2Telemetry;
  const robot = go2RobotInfo;

  return (
    <div className="app-shell">
      <DashboardHeader connectionState="fixture" updateRateHz={robot.updateRateHz} />

      <main id="main-content" className="dashboard">
        <section className="dashboard-intro" aria-labelledby="dashboard-title">
          <div>
            <span className="eyebrow">UADE · Desarrollo de Aplicaciones II</span>
            <h1 id="dashboard-title">Monitor de telemetría</h1>
            <p>Supervisión de motores, orientación, batería y contacto para robots Unitree.</p>
          </div>

          <div className="robot-context" aria-label="Contexto de datos">
            <div className="context-item">
              <span><Radio size={13} aria-hidden="true" /> Robot detectado</span>
              <strong>{robot.displayName}</strong>
              <small>{robot.motorCount} motores · {robot.kind === "quadruped" ? "Cuadrúpedo" : "Humanoide"}</small>
            </div>
            <div className="context-item">
              <span><Server size={13} aria-hidden="true" /> Fuente de datos</span>
              <strong>Fixture local</strong>
              <small>Preparado para Adapter / Facade</small>
            </div>
          </div>
        </section>

        <SessionToolbar sampleCount={go2ImuHistory.length} elapsedSeconds={telemetry.elapsedSeconds} />

        <div className="dashboard-grid">
          <MotorPanel motors={telemetry.motors} expectedCount={robot.motorCount} />

          <div className="dashboard-grid__secondary">
            <ImuPanel imu={telemetry.imu} samples={go2ImuHistory} />
            <BatteryPanel battery={telemetry.battery} />
            <ContactPanel contacts={telemetry.contacts} robotKind={robot.kind} />
          </div>
        </div>

        <footer className="dashboard-footer">
          <span><ShieldCheck size={14} aria-hidden="true" /> Vista de presentación · Sin conexión a un robot físico</span>
          <code>GET /telemetria · WS /ws · {robot.updateRateHz} Hz objetivo</code>
        </footer>
      </main>
    </div>
  );
}

export default App;
