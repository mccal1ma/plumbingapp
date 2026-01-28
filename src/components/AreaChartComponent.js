import {ResponsiveContainer, Area, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';

const AreaChartComponent = ({data}) => {
  return (
    <div className="area-chart">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 50 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Area type="monotone" dataKey="count" stroke="#5a5796" fill="#8884d8" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
 
export default AreaChartComponent;