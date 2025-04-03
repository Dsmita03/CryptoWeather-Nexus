import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";

interface LineChartProps {
  data: { time: number; price: number }[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Bitcoin Price (USD)",
        data: [],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
      },
    ],
  });

  useEffect(() => {
    if (data.length > 0) {
      const sortedData = [...data].sort((a, b) => a.time - b.time); // Ensure data is sorted by time

      setChartData({
        labels: sortedData.map((entry) =>
          new Date(entry.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        ),
        datasets: [
          {
            label: "Bitcoin Price (USD)",
            data: sortedData.map((entry) => entry.price),
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            tension: 0.3,
          },
        ],
      });
    }
  }, [data]);

  return (
    <div className="w-full h-96">
      <Line data={chartData} />
    </div>
  );
};

export default LineChart;
