import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
  const data = {
    labels: ["Bitcoin", "Ethereum", "Solana", "Cardano"],
    datasets: [
      {
        data: [60, 25, 10, 5], // Market Share %
        backgroundColor: ["#f7931a", "#627eea", "#00a3e0", "#0033ad"],
        hoverBackgroundColor: ["#ffb347", "#8c9eff", "#00d1ff", "#3366cc"],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  // ✅ Custom Options for Better UI
  const options = {
    plugins: {
      legend: {
        position: "bottom" as const, // ✅ Improved readability
        labels: {
          font: {
            size: 14,
            weight: "bold",
          },
          color: "#333",
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: any) => {
            const value = tooltipItem.raw;
            return ` ${tooltipItem.label}: ${value}%`;
          },
        },
      },
    },
  };

  return (
    <div className="flex justify-center">
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
