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
        color: "#93a0b2",
        usePointStyle: true,
        pointStyle: "circle",
        boxWidth: 6,
        boxHeight: 6,
        padding: 18,
        font: { family: "Inter, system-ui, sans-serif", size: 11 },
      },
    },
    tooltip: {
      backgroundColor: "rgba(8, 13, 19, 0.95)",
      borderColor: "#2b3948",
      borderWidth: 1,
      titleColor: "#e8eef6",
      bodyColor: "#c4cfdd",
      displayColors: true,
      callbacks: {
        title: (items) => `${items[0]?.label ?? ""} s`,
        label: (context) => ` ${context.dataset.label}: ${Number(context.parsed.y).toFixed(2)}°`,
      },
    },
  },
  scales: {
    x: {
      grid: { color: "rgba(81, 101, 122, 0.16)" },
      border: { color: "#293645" },
      ticks: {
        color: "#65758a",
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
      grid: { color: "rgba(81, 101, 122, 0.2)" },
      border: { display: false },
      ticks: {
        color: "#65758a",
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
        borderColor: "#5cd7e8",
        backgroundColor: "#5cd7e8",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        tension: 0.36,
      },
      {
        label: "Pitch",
        data: samples.map((sample) => sample.pitch),
        borderColor: "#e7b958",
        backgroundColor: "#e7b958",
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 3,
        tension: 0.36,
      },
      {
        label: "Yaw",
        data: samples.map((sample) => sample.yaw),
        borderColor: "#bda3f8",
        backgroundColor: "#bda3f8",
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
