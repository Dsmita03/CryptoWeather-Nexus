import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface TemperatureChartProps {
  data: {
    city: string;
    temperature: number;
  }[];
}

const COLORS = ["#42a5f5", "#66bb6a", "#ffca28", "#ef5350", "#ab47bc"];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { name, value } = payload[0];
    return (
      <div className="bg-white p-3 rounded-xl shadow-md border border-gray-200">
        <p className="text-sm font-semibold text-gray-800">📍 {name}</p>
        <p className="text-sm text-blue-600">🌡 {value}°C</p>
      </div>
    );
  }

  return null;
};

const TemperaturePieChart: React.FC<TemperatureChartProps> = ({ data }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl">
      {/* <h3 className="text-xl font-bold text-center mb-4 text-gray-800">🌡 City Temperature Distribution</h3> */}
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="temperature"
            nameKey="city"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label={({ city, temperature }) => `${city}: ${temperature}°C`}
            isAnimationActive
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="bottom" iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TemperaturePieChart;
