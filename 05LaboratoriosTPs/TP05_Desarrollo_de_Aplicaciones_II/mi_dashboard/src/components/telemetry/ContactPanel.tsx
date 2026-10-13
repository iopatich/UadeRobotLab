import { Footprints } from "lucide-react";
import type { RobotKind } from "../../types/telemetry";
import { Panel } from "../ui/Panel";

interface ContactPanelProps {
  contacts: Record<string, boolean>;
  robotKind: RobotKind;
}

const CONTACT_NAMES: Record<string, string> = {
  FR: "Delantera derecha",
  FL: "Delantera izquierda",
  RR: "Trasera derecha",
  RL: "Trasera izquierda",
};

const CONTACT_ORDER = ["FR", "FL", "RR", "RL"];

export function ContactPanel({ contacts, robotKind }: ContactPanelProps) {
  const go2Contacts = CONTACT_ORDER.filter((label) => label in contacts);
  const activeCount = go2Contacts.filter((label) => contacts[label]).length;
  const isAvailable = robotKind === "quadruped" && go2Contacts.length > 0;

  return (
    <Panel
      icon={Footprints}
      title="Fuerzas y contacto"
      subtitle="Apoyo instantáneo por pata"
      meta={<code>{isAvailable ? `${activeCount} / ${go2Contacts.length} en contacto` : "No disponible"}</code>}
      className="contact-panel"
    >
      {isAvailable ? (
        <div className="contact-grid">
          {go2Contacts.map((label) => {
            const isActive = contacts[label];
            return (
              <article className={`contact-card ${isActive ? "contact-card--active" : ""}`} key={label}>
                <div className="contact-card__heading">
                  <strong>{label}</strong>
                  <span className="contact-indicator" aria-hidden="true" />
                </div>
                <span>{CONTACT_NAMES[label]}</span>
                <div className="contact-card__state">
                  <strong>{isActive ? "Apoyada" : "En el aire"}</strong>
                  <small>{isActive ? "Contacto" : "Sin contacto"}</small>
                </div>
                <div className="contact-track" aria-hidden="true"><span /></div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="empty-state empty-state--contact">
          <Footprints size={22} aria-hidden="true" />
          <div>
            <strong>Dato no disponible para este robot</strong>
            <span>El panel de cuatro patas se muestra únicamente para el Go2.</span>
          </div>
        </div>
      )}
    </Panel>
  );
}
