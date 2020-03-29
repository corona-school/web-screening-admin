import React, { useContext } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { Layout } from "antd";

import UserList from "../components/userList/";
import { ApiContext } from "../api/ApiContext";
import Login from "../components/Login";

const { Content } = Layout;

export default function Routes() {
	const { userIsLoggedIn, currentStudentKey, studentData } = useContext(
		ApiContext
	);

	return (
		<Switch>
			<Route exact path="/">
				<Content
					className="site-layout"
					style={{ padding: "0 50px", marginTop: 64 }}>
					<Login />
				</Content>
			</Route>
			<Route path="/screening">
				{userIsLoggedIn ? (
					<Content
						className="site-layout"
						style={{ padding: "0 50px", marginTop: 64 }}>
						<div
							className="site-layout-background"
							style={{ padding: 24, minHeight: 380 }}>
							<UserList
								currentStudentKey={currentStudentKey}
								studentData={studentData}
							/>
						</div>
					</Content>
				) : (
					<Redirect to="/" />
				)}
			</Route>
		</Switch>
	);
}
