import React, { useContext } from "react";
import { Badge, Typography, Divider } from "antd";
import { ApiContext } from "../api/ApiContext";

import "./ScreenerList.less";

const { Text, Title } = Typography;

const ScreenerList = () => {
	const { screenerOnline } = useContext(ApiContext);

	return (
		<div className="screenerList">
			<Title level={4}>Screener Online</Title>
			{screenerOnline.map((screener, index) => {
				return (
					<>
						<div className="item">
							<Badge color="green" style={{ margin: "1px" }} />
							<div className="itemText">
								<Text className="name">
									{screener.firstname} {screener.lastname}
								</Text>
								<Text className="secondary" type="secondary">
									{screener.email}
								</Text>
							</div>
						</div>
						<Divider style={{ margin: "8px 0px" }} />
					</>
				);
			})}
		</div>
	);
};

export default ScreenerList;
