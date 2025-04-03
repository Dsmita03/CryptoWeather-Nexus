// components/WeatherDetailsTable.tsx

interface WeatherData {
    date: string;
    temperature: number;
    humidity: number;
  }
  
  interface WeatherDetailsTableProps {
    data: WeatherData[];
  }
  
  const WeatherDetailsTable: React.FC<WeatherDetailsTableProps> = ({ data }) => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Date</th>
              <th className="px-4 py-2">Temperature (°C)</th>
              <th className="px-4 py-2">Humidity (%)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={index}>
                <td className="px-4 py-2">{row.date}</td>
                <td className="px-4 py-2">{row.temperature}</td>
                <td className="px-4 py-2">{row.humidity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default WeatherDetailsTable;
  