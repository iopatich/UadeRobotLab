export type TemperatureLevel = "normal" | "warning" | "critical";

export const getTemperatureLevel = (temperature: number): TemperatureLevel => {
  if (temperature < 40) return "normal";
  if (temperature <= 60) return "warning";
  return "critical";
};

export const getTemperatureLabel = (level: TemperatureLevel): string => {
  const labels: Record<TemperatureLevel, string> = {
    normal: "Normal",
    warning: "Precaución",
    critical: "Crítico",
  };

  return labels[level];
};
