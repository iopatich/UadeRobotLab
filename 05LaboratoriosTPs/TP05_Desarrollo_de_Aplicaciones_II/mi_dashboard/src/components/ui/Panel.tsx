import type { LucideIcon } from "lucide-react";
import type { PropsWithChildren, ReactNode } from "react";

interface PanelProps extends PropsWithChildren {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  meta?: ReactNode;
  className?: string;
}

export function Panel({ icon: Icon, title, subtitle, meta, className = "", children }: PanelProps) {
  return (
    <section className={`panel ${className}`.trim()} aria-labelledby={`${title}-title`}>
      <header className="panel__header">
        <div className="panel__heading">
          <span className="panel__icon" aria-hidden="true">
            <Icon size={18} strokeWidth={1.8} />
          </span>
          <div>
            <h2 id={`${title}-title`}>{title}</h2>
            <p>{subtitle}</p>
          </div>
        </div>
        {meta ? <div className="panel__meta">{meta}</div> : null}
      </header>
      {children}
    </section>
  );
}
