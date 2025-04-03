// components/CryptoMetricsTable.tsx

interface CryptoMetrics {
    market_cap: number;
    volume: number;
    supply: number;
  }
  
  interface CryptoMetricsTableProps {
    data: CryptoMetrics;
  }
  
  const CryptoMetricsTable: React.FC<CryptoMetricsTableProps> = ({ data }) => {
    return (
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Metric</th>
            <th className="px-4 py-2">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="px-4 py-2">Market Cap</td>
            <td className="px-4 py-2">${data.market_cap}</td>
          </tr>
          <tr>
            <td className="px-4 py-2">Volume</td>
            <td className="px-4 py-2">${data.volume}</td>
          </tr>
          <tr>
            <td className="px-4 py-2">Supply</td>
            <td className="px-4 py-2">{data.supply}</td>
          </tr>
        </tbody>
      </table>
    );
  };
  
  export default CryptoMetricsTable;
  