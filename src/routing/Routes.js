import React, { useContext } from "react";
import { Switch, Route } from "react-router-dom";
import { Layout } from "antd";

import Login from "../components/Login";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../components/dashboard";
import UserList from "../components/userList";
import { ApiContext } from "../api/ApiContext";
import ScreenerList from "../components/ScreenerList";

const { Content } = Layout;

export default function Routes() {
	const { isScreenerListOpen } = useContext(ApiContext);

	return (
		<Switch>
			<Route exact path="/">
				<Content
					className="site-layout"
					style={{ padding: "0 50px", marginTop: 64 }}>
					<Login />
				</Content>
			</Route>
			<PrivateRoute
				path="/screening"
				component={
					<div className="main">
						<UserList />
						{isScreenerListOpen && <ScreenerList />}
					</div>
				}
			/>
			<PrivateRoute path="/dashboard" component={<Dashboard />} />
		</Switch>
	);
}
