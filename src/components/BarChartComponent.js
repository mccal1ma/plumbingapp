import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const BarChartComponent = ({data}) => {
  return (
    <div className="bar-chart">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" barSize={75} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default BarChartComponent;