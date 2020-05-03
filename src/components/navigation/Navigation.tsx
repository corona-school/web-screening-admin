import React, { useContext, useState } from "react";
import { Menu, Switch, message, Typography, Tooltip } from "antd";
import {
	CheckCircleOutlined,
	DashboardOutlined,
	TableOutlined,
	UserOutlined,
	BookOutlined,
	LikeOutlined,
	CalendarOutlined,
} from "@ant-design/icons";
import Push from "push.js";
import "./Navigation.less";
import { ApiContext } from "../../api/ApiContext";
import { withRouter, RouteComponentProps, useLocation } from "react-router-dom";
import { isNotificationEnabled } from "../../utils/notification";

const { Text } = Typography;

const Navigation = (props: RouteComponentProps) => {
	const [notifyEnabled, setNotifyEnbaled] = useState(isNotificationEnabled);
	const context = useContext(ApiContext);
	const location = useLocation();
	let currentPath = location.pathname;
	console.log(currentPath);

	if (!context) {
		return null;
	}

	const handleClick = (e: any) => {
		if (
			[
				"/screening-times",
				"/mentoring-list",
				"/socialmedia",
				"/screener-docs",
			].includes(e.key)
		) {
			return;
		}
		props.history.push(e.key);
	};

	const askNotificationPermissions = (checked: boolean) => {
		if (Push.Permission.get() === Push.Permission.DENIED) {
			message.info(
				"Du hast Desktop Benachrichtigungen für diese Seite verboten."
			);
			return;
		}
		if (checked) {
			setNotifyEnbaled(true);
			Push.Permission.request(
				() => setNotifyEnbaled(true),
				() => {
					setNotifyEnbaled(false);
				}
			);
			return;
		}
		setNotifyEnbaled(false);
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
					<Menu.Item key="/opening-hours">
						<CalendarOutlined />
						Öffnungszeiten
					</Menu.Item>
				</Menu.ItemGroup>
				<Menu.ItemGroup key="g1" title="Links">
					<Menu.Item key="/screener-docs">
						<BookOutlined />
						<a
							target="_blank"
							rel="noopener noreferrer"
							href="https://drive.google.com/drive/folders/1LEXFw9zXG4mrcnBWmMPgm6lD970PDbOa">
							Screener Material
						</a>
					</Menu.Item>
					<Menu.Item key="/screening-times">
						<TableOutlined />
						<a
							target="_blank"
							rel="noopener noreferrer"
							href="https://docs.google.com/spreadsheets/d/1YEPdtbr1fsMmvIy5nRh_7V9IFEDN67iumTRSDx-mUvk/edit">
							Bereitschaftstabelle
						</a>
					</Menu.Item>
					<Menu.Item key="/mentoring-list">
						<UserOutlined />
						<a
							target="_blank"
							rel="noopener noreferrer"
							href="https://docs.google.com/spreadsheets/d/1GFb-AVmymDoDMQ_rzdD5GwD1zqz8Pk-7mBLxcBeFywg/edit#gid=0">
							Mentoren Liste
						</a>
					</Menu.Item>
					<Menu.Item key="/socialmedia">
						<LikeOutlined />
						<a
							target="_blank"
							rel="noopener noreferrer"
							href="https://drive.google.com/drive/folders/1FQ-ICijXiTRVU2HHZiJuFfOlu1Cb1zyz">
							SocialMedia
						</a>
					</Menu.Item>
				</Menu.ItemGroup>
			</Menu>
			<div className="menu-notification">
				<Text type="secondary">Einstellungen</Text>
				<div className="notification">
					<span>Desktop Benachrichtigung</span>
					<Switch
						size="small"
						checked={notifyEnabled}
						onChange={askNotificationPermissions}
					/>
				</div>
				<Tooltip
					title="Nicht aktive Screener werden bei der Berechnung der Wartezeit nicht berücksichtigt."
					placement="bottom">
					<div className="notification">
						<span>Aktiv</span>
						<Switch
							size="small"
							checked={context?.active}
							onChange={(b) => context?.setActive(b)}
						/>
					</div>
				</Tooltip>
			</div>
		</div>
	);
};

export default withRouter(Navigation);
