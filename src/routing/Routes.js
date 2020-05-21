import React from "react";
import { Switch, Route } from "react-router-dom";
import Login from "../components/Login";
import PrivateRoute from "./PrivateRoute";

export default function Routes() {
	return (
		<Switch>
			<Route exact path="/">
				<Login />
			</Route>
			<PrivateRoute />
		</Switch>
	);
}
