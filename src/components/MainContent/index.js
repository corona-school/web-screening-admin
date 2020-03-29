import React from "react";
import { Layout, Typography } from "antd";
import Routes from "../../routing/Routes";

const { Header } = Layout;
const { Title } = Typography;

const MainContent = () => {
	return (
		<>
			<Layout>
				<Header
					style={{
						position: "fixed",
						zIndex: 1,
						width: "100%",
						padding: "1 rem"
					}}>
					<Title style={{ color: "white" }}>Corona School Screening</Title>
				</Header>
				<Routes />
			</Layout>
		</>
	);
};

export default MainContent;
