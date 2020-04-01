import React, { useContext } from "react";
import { Typography, Button } from "antd";
import Routes from "../routing/Routes";
import "./PageLayout.less";
import { ApiContext } from "../api/ApiContext";

const { Title } = Typography;

const PageLayout = () => {
	const { logoutCall, userIsLoggedIn } = useContext(ApiContext);

	return (
		<>
			<div className="pageContainer">
				<div className="header">
					<Title className="title">Corona School Screening</Title>
					{userIsLoggedIn && (
						<Button style={{ marginRight: "32px" }} onClick={logoutCall}>
							Logout
						</Button>
					)}
				</div>

				<Routes />
			</div>
		</>
	);
};

export default PageLayout;
