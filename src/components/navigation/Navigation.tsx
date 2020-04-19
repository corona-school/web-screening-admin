import React, { useContext } from "react";
import { Menu } from "antd";
import { CheckCircleOutlined, DashboardOutlined } from "@ant-design/icons";
import "./Navigation.less";
import { ApiContext } from "../../api/ApiContext";
import { withRouter, RouteComponentProps, useLocation } from "react-router-dom";

const Navigation = (props: RouteComponentProps) => {
	const context = useContext(ApiContext);
	const location = useLocation();
	let currentPath = location.pathname;
	console.log(currentPath);

	if (!context) {
		return null;
	}

	const handleClick = (e: any) => {
		props.history.push(e.key);
	};

	return (
		<div className="menu-container">
			<Menu
				onClick={handleClick}
				style={{ width: 256 }}
				selectedKeys={[currentPath]}
				mode="inline">
				<Menu.ItemGroup key="g1" title="Navigation">
					<Menu.Item key="/screening">
						<CheckCircleOutlined /> Studenten
					</Menu.Item>
					<Menu.Item key="/dashboard">
						<DashboardOutlined />
						Dashboard
					</Menu.Item>
				</Menu.ItemGroup>
			</Menu>
		</div>
	);
};

export default withRouter(Navigation);
