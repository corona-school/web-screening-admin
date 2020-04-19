/* eslint-disable react-hooks/exhaustive-deps */
import React, { useContext, useEffect } from "react";
import { ApiContext } from "../../api/ApiContext";
import { pure } from "recompose";
import OverviewAnalysis from "./OverviewAnalysis";
import JobPerDay from "./JobPerDay";
import JobPerTime from "./JobPerTime";
import OverviewScreenings from "./OverviewScreenings";

import "./Dashboard.less";

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
