import React, { useContext, useEffect } from "react";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	Area,
	AreaChart,
} from "recharts";
import { ApiContext } from "../../api/ApiContext";
import moment from "moment";
import { Typography } from "antd";

import "./JobPerDay.less";

const { Title } = Typography;

const JobPerDay = () => {
	const context = useContext(ApiContext);

	useEffect(() => {
		context?.getDatabaseStats();
	}, []);

	if (!context) {
		return null;
	}

	const renderCompletedInDay = () => {
		let stats = context.statistics.map((s) =>
			moment(s.createdAt).format("YYYY-MM-DD")
		);

		let counts: any = {};
		for (let i = 0; i < stats.length; i++) {
			counts[stats[i]] = 1 + (counts[stats[i]] || 0);
		}

		const data2: { day: string; count: number }[] = Object.keys(counts)
			.map((key) => ({
				label: moment(key).format("dddd"),
				day: key,
				count: counts[key],
			}))
			.sort((a, b) => moment(a.day).unix() - moment(b.day).unix());

		const graphData = data2.slice(Math.max(data2.length - 7, 1));

		return (
			<AreaChart
				width={1000}
				height={400}
				data={graphData}
				margin={{
					top: 16,
					right: 16,
					left: 16,
					bottom: 16,
				}}>
				<defs>
					<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
						<stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
					</linearGradient>
				</defs>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="label" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Area
					type="monotone"
					dataKey="count"
					stroke="#8884d8"
					fillOpacity={1}
					fill="url(#colorUv)"
					strokeWidth="1px"
					activeDot={{ r: 8 }}
				/>
			</AreaChart>
		);
	};
	return (
		<div className="job-per-day">
			<Title level={4} style={{ color: "#6c757d", marginTop: 0 }}>
				Anzahl an Jobs (letzen Woche)
			</Title>
			<div>{renderCompletedInDay()}</div>
		</div>
	);
};

export default JobPerDay;
