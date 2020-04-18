/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from "react";
import { ApiContext } from "../../api/ApiContext";
import { Statistic, Row, Col, Typography } from "antd";
import { pure } from "recompose";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
} from "recharts";
import moment from "moment";

import "./dashboard.less";

const { Title } = Typography;

const Dashboard = () => {
	const context = useContext(ApiContext);

	useEffect(() => {
		context?.getDatabaseStats();
	}, []);

	if (!context) {
		return null;
	}

	const renderCompletedByScreener = () => {
		let stats = context.statistics.map(
			(s) => s.screener.firstname + " " + s.screener.lastname
		);

		let counts: any = {};
		for (let i = 0; i < stats.length; i++) {
			counts[stats[i]] = 1 + (counts[stats[i]] || 0);
		}

		const data2: any = Object.keys(counts)
			.map((key) => ({
				name: key,
				count: counts[key],
			}))
			.sort((a, b) => b.count - a.count)
			.slice(0, 10);

		return data2.map((user: any, index: number) => {
			return (
				<div className="user" key={user.name}>
					<div>
						{index + 1}. {user.name}
					</div>
					<div>{user.count}</div>
				</div>
			);
		});
	};

	const renderScreeningDuration = () => {
		let stats = context.statistics
			.map((s) => moment(s.finnishedAt).diff(s.createdAt, "minutes"))
			.filter((s) => s !== 0);

		const sum = stats.reduce((a, b) => a + b, 0);
		const avg = sum / stats.length || 0;
		const abs = Math.round(avg);

		const max = Math.max(...stats);
		const min = Math.min(...stats);

		return (
			<Row gutter={18} style={{ margin: "32px" }}>
				<Col span={6}>
					<Statistic title="Durchschnitt" value={abs + " Minuten"} />
				</Col>
				<Col span={6}>
					<Statistic title="Max" value={max + " Minuten"} />
				</Col>
				<Col span={6}>
					<Statistic title="Min" value={min + " Minuten"} />
				</Col>
			</Row>
		);
	};

	const renderCompletedByHour = () => {
		let stats = context.statistics.map((s) => moment(s.createdAt).format("HH"));

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
			<LineChart
				width={800}
				height={300}
				data={data2}
				margin={{
					top: 16,
					right: 16,
					left: 16,
					bottom: 16,
				}}>
				<CartesianGrid strokeDasharray="5 5" />
				<XAxis dataKey="hour" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Line
					type="monotone"
					dataKey="count"
					stroke="#8884d8"
					activeDot={{ r: 8 }}
				/>
			</LineChart>
		);
	};

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

		return (
			<LineChart
				width={800}
				height={300}
				data={data2}
				margin={{
					top: 16,
					right: 16,
					left: 16,
					bottom: 16,
				}}>
				<CartesianGrid strokeDasharray="5 5" />
				<XAxis dataKey="label" />
				<YAxis />
				<Tooltip />
				<Legend />
				<Line
					type="monotone"
					dataKey="count"
					stroke="#82ca9d"
					activeDot={{ r: 8 }}
				/>
			</LineChart>
		);
	};

	const completed = context?.statistics.filter((item) => item.completed).length;
	const rejected = context?.statistics.filter((item) => !item.completed).length;

	return (
		<div className="dashboard-container">
			<div className="dashboard">
				<Title level={3}>Die Queue in Zahlen:</Title>
				<Row gutter={18} style={{ margin: "32px" }}>
					<Col span={6}>
						<Statistic title="Alle" value={completed + rejected} />
					</Col>
					<Col span={6}>
						<Statistic title="Verifiziert" value={completed} />
					</Col>
					<Col span={6}>
						<Statistic title="Abgelehnt" value={rejected} />
					</Col>
				</Row>
				<Title level={3}>Anzahl an Jobs pro Tag:</Title>
				{renderCompletedInDay()}
				<Title level={3}>Anzahl an Jobs pro Stunde:</Title>
				{renderCompletedByHour()}
				<Title level={3}>Länge der Screenings:</Title>
				{renderScreeningDuration()}
			</div>
		</div>
	);
};

export default pure(Dashboard);
