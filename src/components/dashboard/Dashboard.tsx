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

import "./Dashboard.less";
import OverviewAnalysis from "./OverviewAnalysis";
import JobPerDay from "./JobPerDay";
import JobPerTime from "./JobPerTime";
import OverviewScreenings from "./OverviewScreenings";

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

	return (
		<div className="dashboard-container">
			<div className="dashboard">
				<OverviewAnalysis />
				<JobPerDay />
				<JobPerTime />
				<OverviewScreenings />
			</div>
		</div>
	);
};

export default pure(Dashboard);
