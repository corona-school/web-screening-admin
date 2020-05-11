import React, { useState } from "react";
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
import { Typography, Radio } from "antd";

import "./JobPerDay.less";
import { Statistic } from "../../api/useStatistics";

const { Title } = Typography;

interface Props {
	statistics: Statistic[];
}
const hours = [
	"09",
	"10",
	"11",
	"12",
	"13",
	"14",
	"15",
	"16",
	"17",
	"18",
	"19",
	"20",
];

const JobPerTime = ({ statistics }: Props) => {
	const [period, setPeriod] = useState("a");

	const renderCompletedByHour = () => {
		let stats = statistics
			.map((s) => moment(s.createdAt).add(1, "hour"))
			.filter((s) => {
				if (period === "a") return s.isSame(new Date(), "week");
				if (period === "b") return s.isSame(new Date(), "month");
				return true;
			})
			.map((s) => s.format("HH"));

		let counts: any = {};

		hours.forEach((s) => {
			counts[s] = 0;
		});
		for (const timeEntry of stats) {
			counts[timeEntry] = 1 + (counts[timeEntry] || 0);
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
				<XAxis
					dataKey="hour"
					label={{
						value: "Uhrzeit in Stunden",
						position: "insideBottomRight",
						offset: -10,
					}}
				/>
				<YAxis
					label={{ value: "Anzahl", angle: -90, position: "insideLeft" }}
				/>
				<Tooltip />
				<Legend />
				<Area
					type="step"
					dataKey="count"
					stroke="#82ca9d"
					name="Anzahl"
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
			<div className="dashboard-header-jobs">
				<Title level={4} style={{ color: "#6c757d", marginTop: 0 }}>
					Anzahl an Jobs pro Stunde:
				</Title>
				<Radio.Group
					value={period}
					onChange={(change) => setPeriod(change.target.value)}>
					<Radio.Button value="a">Woche</Radio.Button>
					<Radio.Button value="b">Monat</Radio.Button>
					<Radio.Button value="c">Gesamt</Radio.Button>
				</Radio.Group>
			</div>
			{renderCompletedByHour()}
		</div>
	);
};

export default JobPerTime;
