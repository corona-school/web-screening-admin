import React from "react";
import OverviewAnalysis from "../dashboard/OverviewAnalysis";
import Queue from "./Queue";
import "./UserList.less";
import useStatistics from "../../api/useStatistics";

const UserList = () => {
	const { statistics, loading } = useStatistics();

	return (
		<div className="screening-container">
			<OverviewAnalysis statistics={statistics} />
			<Queue />
		</div>
	);
};

export default UserList;
