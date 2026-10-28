import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Line } from "react-chartjs-2";
import type { ImuHistorySample } from "../types/telemetry";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface ImuChartProps {
  samples: ImuHistorySample[];
}

const buildOptions = (visibleWindowSeconds: number): ChartOptions<"line"> => ({
  responsive: true,
  maintainAspectRatio: false,
  animation: false,
  normalized: true,
  interaction: { intersect: false, mode: "index" },
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      align: "start",
      labels: {
        color: "#69ad7d",
        usePointStyle: true,
        pointStyle: "circle",
        boxWidth: 6,
        boxHeight: 6,
        padding: 18,
        font: { family: "Consolas, Cascadia Mono, ui-monospace, monospace", size: 11 },
      },
    },
    tooltip: {
      backgroundColor: "rgba(1, 8, 4, 0.97)",
      borderColor: "#28d866",
      borderWidth: 1,
      titleColor: "#46ff83",
      bodyColor: "#bfffcf",
      displayColors: true,
      callbacks: {
        title: (items) => `${items[0]?.label ?? ""} s`,
        label: (context) => ` ${context.dataset.label}: ${Number(context.parsed.y).toFixed(2)}°`,
      },
    },
  },
  scales: {
    x: {
      grid: { color: "rgba(44, 255, 112, 0.1)" },
      border: { color: "#145c33" },
      ticks: {
        color: "#4c8a60",
        maxTicksLimit: 4,
        font: { family: "ui-monospace, SFMono-Regular, monospace", size: 10 },
        callback: (_value, index, ticks) => {
          if (index === 0) return `−${visibleWindowSeconds.toFixed(1)} s`;
          if (index === ticks.length - 1) return "Ahora";
          return "";
        },
      },
    },
    y: {
      suggestedMin: -8,
      suggestedMax: 18,
      grid: { color: "rgba(44, 255, 112, 0.12)" },
      border: { display: false },
      ticks: {
        color: "#4c8a60",
        maxTicksLimit: 4,
        callback: (value) => `${value}°`,
        font: { family: "ui-monospace, SFMono-Regular, monospace", size: 10 },
      },
    },
  },
});

export function ImuChart({ samples }: ImuChartProps) {
  const visibleWindowSeconds = samples.length > 1
    ? samples[samples.length - 1].elapsedSeconds - samples[0].elapsedSeconds
    : 0;
  const options = buildOptions(visibleWindowSeconds);
  const data: ChartData<"line"> = {
    labels: samples.map((sample) => sample.elapsedSeconds.toFixed(1)),
    datasets: [
      {
        label: "Roll",
        data: samples.map((sample) => sample.roll),
        borderColor: "#39ff7a",
        backgroundColor: "#39ff7a",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        tension: 0.36,
      },
      {
        label: "Pitch",
        data: samples.map((sample) => sample.pitch),
        borderColor: "#ffb000",
        backgroundColor: "#ffb000",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        tension: 0.36,
      },
      {
        label: "Yaw",
        data: samples.map((sample) => sample.yaw),
        borderColor: "#ff46e7",
        backgroundColor: "#ff46e7",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        tension: 0.36,
      },
    ],
  };

  return (
    <div className="imu-chart" role="img" aria-label="Histórico de los ángulos roll, pitch y yaw">
      <Line data={data} options={options} />
    </div>
  );
}
