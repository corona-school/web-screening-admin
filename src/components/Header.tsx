import React, { useContext } from "react";
import { Typography, Dropdown, Menu, Button, Badge, Tag } from "antd";
import {
	DownOutlined,
	LogoutOutlined,
	UserOutlined,
	DashboardOutlined,
	CheckCircleOutlined,
} from "@ant-design/icons";
import { ApiContext } from "../api/ApiContext";
import "./Header.less";
import { withRouter, RouteComponentProps } from "react-router-dom";

const { Title } = Typography;
const Header = (props: RouteComponentProps) => {
	const context = useContext(ApiContext);
	if (!context) {
		return null;
	}

	const renderProfileMenu = () => {
		const menu = (
			<Menu>
				<Menu.Item>
					<UserOutlined />
					Profile
				</Menu.Item>
				<Menu.Item
					onClick={() => {
						props.history.push("/screening");
					}}>
					<CheckCircleOutlined />
					Studenten
				</Menu.Item>
				<Menu.Item
					onClick={() => {
						props.history.push("/dashboard");
					}}>
					<DashboardOutlined />
					Dashboard
					<Tag color="green" style={{ marginLeft: "8px" }}>
						new
					</Tag>
				</Menu.Item>
				<Menu.Item onClick={context.logoutCall}>
					<LogoutOutlined />
					Logout
				</Menu.Item>
				<Menu.Divider />
				<Menu.Item
					key="3"
					onClick={() =>
						context.setScreenerListOpen(!context.isScreenerListOpen)
					}>
					{context.screenerOnline.length} Screener Online
				</Menu.Item>
			</Menu>
		);

		return (
			<Dropdown overlay={menu}>
				<Button className="dropdownButton" style={{ width: "160px" }}>
					<Badge color="green" />
					<span>
						{context.user?.firstname} {context.user?.lastname}
					</span>
					<DownOutlined />
				</Button>
			</Dropdown>
		);
	};

	return (
		<div className="header">
			<div className="logo">
				<img src="/corona-school.svg" alt="logo" />
				<Title className="title">Screener</Title>
			</div>
			{context.userIsLoggedIn && context.user && renderProfileMenu()}
		</div>
	);
};

export default withRouter(Header);
