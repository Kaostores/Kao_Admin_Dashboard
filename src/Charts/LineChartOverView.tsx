
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from "recharts";

const LineChartOverView = ({ data }: any) => {
	const chartData = [
		{
			name: "Sunday",
			revenue: data?.sunday?.revenue || 0,
			expense: data?.sunday?.expense || 0,
		},
		{
			name: "Monday",
			revenue: data?.monday?.revenue || 0,
			expense: data?.monday?.expense || 0,
		},
		{
			name: "Tuesday",
			revenue: data?.tuesday?.revenue || 0,
			expense: data?.tuesday?.expense || 0,
		},
		{
			name: "Wednesday",
			revenue: data?.wednesday?.revenue || 0,
			expense: data?.wednesday?.expense || 0,
		},
		{
			name: "Thursday",
			revenue: data?.thursday?.revenue || 0,
			expense: data?.thursday?.expense || 0,
		},
		{
			name: "Friday",
			revenue: data?.friday?.revenue || 0,
			expense: data?.friday?.expense || 0,
		},
		{
			name: "Saturday",
			revenue: data?.saturday?.revenue || 0,
			expense: data?.saturday?.expense || 0,
		},
	];

	return (
		<div className='w-full'>
			<ResponsiveContainer width='100%' aspect={4.0 / 1.5}>
				<LineChart
					data={chartData}
					margin={{
						top: 5,
						right: 30,
						left: 20,
						bottom: 5,
					}}>
					<CartesianGrid strokeDasharray='3 3' />
					<XAxis dataKey='name' />
					<YAxis />
					<Legend />
					<Line
						type='monotone'
						dataKey='revenue'
						stroke='#0333ae'
						activeDot={{ r: 8 }}
					/>
					<Line type='monotone' dataKey='expense' stroke='#CED6DE' />
					<Tooltip offset={-1} />
				</LineChart>
			</ResponsiveContainer>
		</div>
	);
};

export default LineChartOverView;