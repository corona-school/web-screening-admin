import React from "react";
import { Typography } from "antd";
import Routes from "../routing/Routes";
import "./PageLayout.less";

const { Title } = Typography;

const PageLayout = () => {
	return (
		<>
			<div className="pageContainer">
				<div className="header">
					<Title className="title">Corona School Screening</Title>
				</div>

				<Routes />
			</div>
		</>
	);
};

export default PageLayout;
