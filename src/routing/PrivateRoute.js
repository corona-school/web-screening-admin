import React, { useContext, useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import { ApiContext } from "../api/ApiContext";
import "./PrivateRoute.less";
import * as Sentry from "@sentry/browser";
import LogRocket from "logrocket";

const PrivateRoute = ({ path, component }) => {
	const {
		userIsLoggedIn,
		setUserIsLoggedIn,
		setUser,
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
					Sentry.configureScope((scope) => {
						scope.setUser({ email: data.email, id: data.email });
						scope.setTag("user", data.email);
					});
					LogRocket.identify("user", {
						name: data.firstname + " " + data.lastname,
						email: data.email,
						subscriptionType: "screener",
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

	return (
		<>
			<Route path={path}>
				{userIsLoggedIn && !loading ? component : <Redirect to="/" />}
			</Route>
		</>
	);
};

export default PrivateRoute;
