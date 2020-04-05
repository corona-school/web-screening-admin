import React, { useContext } from "react";
import { Typography, Dropdown, Menu, Button, Badge } from "antd";
import { DownOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { ApiContext } from "../api/ApiContext";
import "./Header.less";

const { Title } = Typography;
const Header = () => {
	const {
		logoutCall,
		userIsLoggedIn,
		user,
		screenerOnline,
		isScreenerListOpen,
		setScreenerListOpen,
	} = useContext(ApiContext);

	const renderProfileMenu = () => {
		const menu = (
			<Menu>
				<Menu.Item>
					<UserOutlined />
					Profile
				</Menu.Item>
				<Menu.Item onClick={logoutCall}>
					<LogoutOutlined />
					Logout
				</Menu.Item>
				<Menu.Divider />
				<Menu.Item
					key="3"
					onClick={() => setScreenerListOpen(!isScreenerListOpen)}>
					{screenerOnline.length} Screener Online
				</Menu.Item>
			</Menu>
		);

		return (
			<Dropdown overlay={menu}>
				<Button className="dropdownButton" style={{ width: "140px" }}>
					<Badge color="green" />
					<span classname="username">
						{user.firstname} {user.lastname}
					</span>
					<DownOutlined />
				</Button>
			</Dropdown>
		);
	};

	return (
		<div className="header">
			<div className="logo">
				<img src="/corona-school.svg" />
				<Title className="title">Admin</Title>
			</div>
			{userIsLoggedIn && user && renderProfileMenu()}
		</div>
	);
};

export default Header;
