import React from "react";
import { Switch, Route } from "react-router-dom";
import { Layout } from "antd";

import Login from "../components/Login";
import PrivateRoute from "./PrivateRoute";

const { Content } = Layout;

export default function Routes() {
	return (
		<Switch>
			<Route exact path="/">
				<Content
					className="site-layout"
					style={{ padding: "0 50px", marginTop: 64 }}>
					<Login />
				</Content>
			</Route>
			<PrivateRoute path="/screening" />
		</Switch>
	);
}
