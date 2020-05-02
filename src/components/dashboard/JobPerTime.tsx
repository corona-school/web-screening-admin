import React from "react";
import {
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	AreaChart,
	Area,
} from "recharts";
import moment from "moment";
import { Typography } from "antd";

import "./JobPerDay.less";
import { Statistic } from "../../api/useStatistics";

const { Title } = Typography;

interface Props {
	statistics: Statistic[];
}

const JobPerTime = ({ statistics }: Props) => {
	const renderCompletedByHour = () => {
		let stats = statistics.map((s) => moment(s.createdAt).format("HH"));

		let counts: any = {};
		for (let i = 0; i < stats.length; i++) {
			counts[stats[i]] = 1 + (counts[stats[i]] || 0);
		}

		const data2: any = Object.keys(counts)
			.map((key) => ({
				label: key + "Uhr",
				hour: parseInt(key),
				count: counts[key],
			}))
			.sort((a, b) => a.hour - b.hour);

		return (
			<AreaChart
				width={1000}
				height={300}
				data={data2}
				margin={{
					top: 16,
					right: 16,
					left: 16,
					bottom: 16,
				}}>
				<defs>
					<linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
						<stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
					</linearGradient>
				</defs>
				<CartesianGrid strokeDasharray="5 5" />
				<XAxis dataKey="hour" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Area
					type="monotone"
					dataKey="count"
					stroke="#82ca9d"
					fillOpacity={1}
					fill="url(#colorPv)"
					strokeWidth="1px"
					activeDot={{ r: 8 }}
				/>
			</AreaChart>
		);
	};

	return (
		<div className="job-per-day">
			<Title level={4} style={{ color: "#6c757d", marginTop: 0 }}>
				Anzahl an Jobs pro Stunde:
			</Title>

			{renderCompletedByHour()}
		</div>
	);
};

export default JobPerTime;
