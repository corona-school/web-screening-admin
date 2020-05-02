import React from "react";
import { Typography, Divider } from "antd";
import "./OverviewAnalysis.less";
import {
	RiseOutlined,
	FallOutlined,
	HourglassOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { Statistic } from "../../api/useStatistics";

const { Title } = Typography;

interface Props {
	statistics: Statistic[];
}

const OverviewScreenings = ({ statistics }: Props) => {
	let stats = statistics
		.map((s) => moment(s.finnishedAt).diff(s.createdAt, "minutes"))
		.filter((s) => s !== 0);

	const sum = stats.reduce((a, b) => a + b, 0);
	const avg = sum / stats.length || 0;
	const abs = Math.round(avg);

	const max = Math.max(...stats);
	const min = Math.min(...stats);
	return (
		<div className="overview-analysis-container">
			<Title style={{ color: "#6c757d", marginTop: 0 }} level={4}>
				Länge der Screenings
			</Title>
			<div className="numbers">
				<div className="statistic">
					<div className="statistic-icon">
						<HourglassOutlined />
					</div>
					<div className="statistic-title">{abs}</div>
					<div className="statistic-description">Durchschnitt</div>
				</div>
				<Divider type="vertical" style={{ height: "100%" }} />
				<div className="statistic">
					<div className="statistic-icon">
						<RiseOutlined />
					</div>
					<div className="statistic-title">{max}</div>
					<div className="statistic-description">Längstes</div>
				</div>
				<Divider type="vertical" style={{ height: "100%" }} />
				<div className="statistic">
					<div className="statistic-icon">
						<FallOutlined />
					</div>
					<div className="statistic-title">{min}</div>
					<div className="description">Kürzestes</div>
				</div>
			</div>
		</div>
	);
};

export default OverviewScreenings;
