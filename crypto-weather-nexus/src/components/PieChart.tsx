import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend, ChartOptions } from "chart.js";

// Registering necessary components of Chart.js
Chart.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  data: { name: string; value: number }[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
  // Convert the `data` prop into the format expected by Chart.js
  const labels = data.map(item => item.name);
  const chartData = data.map(item => item.value);

  const chartDataSet = {
    labels: labels,
    datasets: [
      {
        data: chartData, // Use values from `data`
        backgroundColor: ["#f7931a", "#627eea", "#00a3e0", "#0033ad"], // You can modify or make this dynamic as needed
        hoverBackgroundColor: ["#ffb347", "#8c9eff", "#00d1ff", "#3366cc"], // Same here
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  // ✅ Custom Options for Better UI
  const options: ChartOptions<'pie'> = {
    plugins: {
      legend: {
        position: "bottom", // ✅ Improved readability
        labels: {
          font: {
            size: 14,
            weight: "bold" as const, // Ensure 'weight' is of type 'bold' or similar valid value
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
      <Pie data={chartDataSet} options={options} />
    </div>
  );
};

export default PieChart;
