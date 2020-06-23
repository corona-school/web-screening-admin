import React, { useContext, useState, useEffect } from "react";
import { Typography, Dropdown, Menu, Tag, Input, AutoComplete, Affix } from "antd";
import {
	LogoutOutlined,
	UserOutlined,
	DashboardOutlined,
	CheckCircleOutlined,
	TeamOutlined
} from "@ant-design/icons";
import { ApiContext } from "../api/ApiContext";
import classes from "./Header.module.less";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import { SelectProps } from "antd/lib/select";

const { Search } = Input;

const { Title } = Typography;
const Header = (props: RouteComponentProps) => {
	const [options, setOptions] = useState<SelectProps<object>["options"]>([]);
	const context = useContext(ApiContext);

	useEffect(() => {
		context?.getAllStudents();
	}, []);

	if (!context) {
		return null;
	}

	const renderProfileMenu = () => {
		const menu = (
			<Menu>
				<Menu.Item disabled>
					<UserOutlined />
					Profile
				</Menu.Item>
				<Menu.Item disabled
					onClick={() => {
						props.history.push("/dashboard");
					}}>
					<DashboardOutlined />
					Dashboard
					<Tag color="green" style={{ marginLeft: "8px" }}>
						new
					</Tag>
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
						props.history.push("/courses");
					}}>
					<TeamOutlined />
					Kurse
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
				<div className={classes.ProfileMenu}>
					<div className={classes.ProfileImage}>
						<span>
							{context.user?.firstname[0]}
							{context.user?.lastname[0]}
						</span>
					</div>
					<div className={classes.ProfileTextContainer}>
						<span className={classes.ProfileName}>
							{context.user?.firstname} {context.user?.lastname}
						</span>
						<span className={classes.ProfileJob}>Screener</span>
					</div>
				</div>
			</Dropdown>
		);
	};

	const renderSearchStudent = () => {
		const searchResult = (query: string) => {
			return context.students
				.map((i) => ({
					...i,
					text: `${i.firstname} ${i.lastname} ${i.email}`,
				}))
				.filter((i) => i.text.indexOf(query) !== -1)
				.map((item, idx) => {
					return {
						value: item.email,
						label: (
							<div
								style={{
									display: "flex",
									flexDirection: "column",
								}}>
								<span>
									{item.firstname} {item.lastname}
								</span>
								<span>{item.email}</span>
							</div>
						),
					};
				});
		};
		const handleSearch = (value: string) => {
			setOptions(value ? searchResult(value) : []);
		};

		const onSelect = (value: string) => {
			props.history.push(`/student/${value}`);
		};
		return (
			<div className={classes.searchInput}>
				<AutoComplete
					dropdownMatchSelectWidth={252}
					style={{ width: 300 }}
					options={options}
					onSelect={onSelect}
					onSearch={handleSearch}>
					<Search
						style={{ width: "300px" }}
						placeholder="Suche nach einem Student..."
						onSearch={(value) => {
							props.history.push(`/student/${value}`);
						}}
						enterButton
					/>
				</AutoComplete>
			</div>
		);
	};

	return (
		<Affix>
			<div className={classes.header}>
				<div className={classes.logo}>
					<Link to="/screening">
						<div className={classes.logo}>
							<img src="/corona-school.svg" alt="logo" />
							<Title
								level={4}
								className="title"
								style={{ color: "white", paddingLeft: "12px" }}>
								Screener
						</Title>
						</div>
					</Link>
					{context.userIsLoggedIn && context.user && renderSearchStudent()}
				</div>

				{context.userIsLoggedIn && context.user && renderProfileMenu()}
			</div>
		</Affix>
	);
};

export default withRouter(Header);
