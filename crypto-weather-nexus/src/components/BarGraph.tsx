import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// ✅ Register necessary Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// ✅ Props Interface for Dynamic Data
interface BarGraphProps {
  prices: { name: string; price: number }[];
}

const BarGraph: React.FC<BarGraphProps> = ({ prices }) => {
  // Debugging: log prices to ensure it's being passed correctly
  console.log("BarGraph prices:", prices);

  // Ensure data exists before proceeding
  const data = {
    labels: prices.map((crypto) => crypto.name),
    datasets: [
      {
        label: "Price (USD)",
        data: prices.map((crypto) => crypto.price),
        backgroundColor: ["#ff7f50", "#ffa500", "#ff6347", "#f7931a"]

      },
    ],
  };

  // ✅ Responsive Options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true },
      tooltip: { enabled: true },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="w-full h-80"> {/* ✅ Prevent overflow */}
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarGraph;
