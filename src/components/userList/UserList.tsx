import React from "react";
import OverviewAnalysis from "../dashboard/OverviewAnalysis";
import Queue from "./Queue";
import "./UserList.less";

const UserList = () => {
	return (
		<div className="container">
			<OverviewAnalysis />
			<Queue />
		</div>
	);
};

export default UserList;
