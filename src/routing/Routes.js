import React, { useContext } from "react";
import { Switch, Route } from "react-router-dom";
import Login from "../components/Login";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "../components/dashboard/Dashboard";
import UserList from "../components/userList/UserList";
import { ApiContext } from "../api/ApiContext";
import ScreenerList from "../components/ScreenerList";
import Navigation from "../components/navigation/Navigation";
import StudentInfo from "../components/student/StudentInfo";
import OpeningHours from "../components/openingHours/OpeningHours";

export default function Routes() {
	const { isScreenerListOpen } = useContext(ApiContext);

	return (
		<Switch>
			<Route exact path="/">
				<Login />
			</Route>
			<PrivateRoute
				path="/screening"
				component={
					<div className="main">
						<Navigation />
						<UserList />
						{isScreenerListOpen && <ScreenerList />}
					</div>
				}
			/>
			<PrivateRoute
				path="/dashboard"
				component={
					<div className="main">
						<Navigation />
						<Dashboard />
						{isScreenerListOpen && <ScreenerList />}
					</div>
				}
			/>

			<PrivateRoute
				path="/opening-hours"
				component={
					<div className="main">
						<Navigation />
						<OpeningHours />
					</div>
				}
			/>
			<PrivateRoute
				path="/student/:email"
				component={
					<div className="main">
						<Navigation />
						<StudentInfo />
					</div>
				}
			/>
		</Switch>
	);
}
