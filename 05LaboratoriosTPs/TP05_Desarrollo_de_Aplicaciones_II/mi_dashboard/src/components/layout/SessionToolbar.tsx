import { Camera, Download, FolderClock } from "lucide-react";

interface SessionToolbarProps {
  sampleCount: number;
  elapsedSeconds: number;
}

const formatElapsedTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export function SessionToolbar({ sampleCount, elapsedSeconds }: SessionToolbarProps) {
  return (
    <section className="session-toolbar" aria-label="Estado de la sesión">
      <div className="session-toolbar__info">
        <FolderClock size={17} aria-hidden="true" />
        <span className="session-toolbar__label">Sesión</span>
        <strong>UI-PREVIEW</strong>
        <span className="session-toolbar__divider" aria-hidden="true" />
        <span>Tiempo de API</span>
        <code>{formatElapsedTime(elapsedSeconds)}</code>
        <span className="session-toolbar__divider" aria-hidden="true" />
        <span>{sampleCount} muestras en gráfico</span>
      </div>

      <div className="session-toolbar__actions">
        <button type="button" disabled title="Se conectará en la etapa de integración">
          <Camera size={16} aria-hidden="true" />
          Capturar muestra
        </button>
        <button type="button" disabled title="La exportación CSV queda reservada para integración">
          <Download size={16} aria-hidden="true" />
          Exportar CSV
        </button>
      </div>
    </section>
  );
}
