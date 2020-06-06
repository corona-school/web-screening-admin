import React from "react";
import Queue from "./Queue";
import "./UserList.less";

const UserList = () => {
	return (
		<div className="screening-container">
			{/* <OverviewAnalysis statistics={statistics} /> */}
			<Queue />
		</div>
	);
};

export default UserList;
