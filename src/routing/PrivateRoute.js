import React, { useContext, useEffect, useState } from "react";
import { Route, Redirect, Switch } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { ApiContext } from "../api/ApiContext";
import "./PrivateRoute.less";
import * as Sentry from "@sentry/browser";

import Screening from "../components/screening";
import Navigation from "../components/navigation/Navigation";
import UserList from "../components/userList/UserList";
import ScreenerList from "../components/ScreenerList";
import Dashboard from "../components/dashboard/Dashboard";
import OpeningHours from "../components/openingHours/OpeningHours";
import Courses from "../components/courses/Courses";
import StudentInfo from "../components/student/StudentInfo";
import * as FullStory from "@fullstory/browser";

const PrivateRoute = () => {
	const {
		userIsLoggedIn,
		setUserIsLoggedIn,
		setUser,
		isScreenerListOpen,
		checkLoginStatus,
	} = useContext(ApiContext);

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		console.log(userIsLoggedIn);

		if (!userIsLoggedIn) {
			setLoading(true);
			checkLoginStatus()
				.then(({ data }) => {
					setUser(data);
					FullStory.identify(data.email, {
						displayName: `${data.firstname} ${data.lastname}`,
						email: data.email,
					});
					Sentry.configureScope((scope) => {
						scope.setUser({ email: data.email, id: data.email });
						scope.setTag("user", data.email);
					});

					setUserIsLoggedIn(true);
					setLoading(false);
				})
				.catch((err) => {
					console.error(err);
					setUser(null);
					setUserIsLoggedIn(false);
					setLoading(false);
				});
		} else {
			setLoading(false);
		}
	}, []);
	if (loading) {
		return (
			<div className="loadingContainer">
				<ClipLoader size={120} color={"#25b864"} loading={loading} />
			</div>
		);
	}

	if (!loading && !userIsLoggedIn) {
		return <Redirect to="/" />;
	}

	return (
		<Switch>
			<Route path="/screening/:email/:room">
				<Screening />
			</Route>
			<Route path="/screening">
				<div className="main">
					<Navigation />
					<UserList />
					{isScreenerListOpen && <ScreenerList />}
				</div>
			</Route>
			<Route path="/dashboard">
				<div className="main">
					<Navigation />
					<Dashboard />
					{isScreenerListOpen && <ScreenerList />}
				</div>
			</Route>

			<Route path="/opening-hours">
				<div className="main">
					<Navigation />
					<OpeningHours />
				</div>
			</Route>
			<Route path="/student/:email">
				<div className="main">
					<Navigation />
					<StudentInfo />
				</div>
			</Route>
			<Route path="/courses">
				<div className="main">
					<Navigation />
					<Courses />
					{isScreenerListOpen && <ScreenerList />}
				</div>
			</Route>
		</Switch>
	);
};

export default PrivateRoute;
