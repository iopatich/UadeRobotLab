import { Camera, Download, FolderClock } from "lucide-react";

interface SessionToolbarProps {
  sessionLabel: string;
  sampleCount: number;
  elapsedSeconds: number;
  captureCount: number;
  canCapture: boolean;
  onCapture: () => void;
  onExportCsv: () => void;
}

const formatElapsedTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export function SessionToolbar({
  sessionLabel,
  sampleCount,
  elapsedSeconds,
  captureCount,
  canCapture,
  onCapture,
  onExportCsv,
}: SessionToolbarProps) {
  return (
    <section className="session-toolbar" aria-label="Estado de la sesión">
      <div className="session-toolbar__info">
        <FolderClock size={17} aria-hidden="true" />
        <span className="session-toolbar__label">Sesión</span>
        <strong>{sessionLabel}</strong>
        <span className="session-toolbar__divider" aria-hidden="true" />
        <span>Tiempo de API</span>
        <code>{formatElapsedTime(elapsedSeconds)}</code>
        <span className="session-toolbar__divider" aria-hidden="true" />
        <span>{sampleCount} muestras en gráfico</span>
        {captureCount > 0 ? (
          <>
            <span className="session-toolbar__divider" aria-hidden="true" />
            <span>{captureCount} captura{captureCount === 1 ? "" : "s"}</span>
          </>
        ) : null}
      </div>

      <div className="session-toolbar__actions">
        <button
          type="button"
          disabled={!canCapture}
          onClick={onCapture}
          title={canCapture ? "Guarda el snapshot actual en la sesión" : "Esperando datos en vivo"}
        >
          <Camera size={16} aria-hidden="true" />
          Capturar muestra
        </button>
        <button
          type="button"
          disabled={captureCount === 0}
          onClick={onExportCsv}
          title={captureCount === 0 ? "Capturá al menos una muestra para exportar" : "Descarga las capturas en formato CSV"}
        >
          <Download size={16} aria-hidden="true" />
          Exportar CSV
        </button>
      </div>
    </section>
  );
}
