import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
} from "recharts";

const data = [
	{
		name: "Mon",
		uv: 1000,
		amt: 2400,
	},
	{
		name: "Tue",
		uv: 2300,
		amt: 2210,
	},
	{
		name: "Wed",
		uv: 2550,
		amt: 2290,
	},
	{
		name: "Thur",
		uv: 2780,
		amt: 2000,
	},
	{
		name: "Fri",
		uv: 3000,
		amt: 2181,
	},
	{
		name: "Sat",
		uv: 3500,
		amt: 2500,
	},
	{
		name: "Sun",
		uv: 5000,
		amt: 2100,
	},
];

const LineChartOverViewWallet = () => {
	return (
		<div className='w-full flex items-start justify-start'>
			{/* <ResponsiveContainer width='100%' height='100%'> */}
			<LineChart
				width={400}
				height={250}
				data={data}
				margin={{
					top: 2,
					right: 30,
					left: 0,
					bottom: 30,
				}}>
				<CartesianGrid strokeDasharray='3 3' />
				<XAxis dataKey='name' />
				<YAxis />
				<Tooltip />
				{/* <Legend /> */}
				<Line
					type='monotone'
					dataKey='pv'
					stroke='#8884d8'
					activeDot={{ r: 8 }}
				/>
				<Line type='monotone' dataKey='uv' stroke='#0000ff' />
			</LineChart>
			{/* </ResponsiveContainer> */}
		</div>
	);
};

export default LineChartOverViewWallet;
