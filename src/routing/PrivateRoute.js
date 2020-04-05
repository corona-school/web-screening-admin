import React, { useContext, useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { Layout } from "antd";
import ClipLoader from "react-spinners/ClipLoader";
import UserList from "../components/userList";
import { ApiContext } from "../api/ApiContext";
import "./PrivateRoute.less";
import ScreenerList from "../components/ScreenerList";

const { Content } = Layout;

const PrivateRoute = () => {
	const {
		userIsLoggedIn,
		setUserIsLoggedIn,
		setUser,
		checkLoginStatus,
		currentStudentKey,
		studentData,
		isScreenerListOpen,
	} = useContext(ApiContext);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!userIsLoggedIn) {
			setLoading(true);
			checkLoginStatus()
				.then(({ data }) => {
					setUser(data);
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
	});

	if (loading) {
		return (
			<div className="loadingContainer">
				<ClipLoader size={120} color={"#25b864"} loading={loading} />
			</div>
		);
	}

	return (
		<Route path="/screening">
			{userIsLoggedIn && !loading ? (
				<div className="main">
					<UserList
						currentStudentKey={currentStudentKey}
						studentData={studentData}
					/>
					{isScreenerListOpen && <ScreenerList />}
				</div>
			) : (
				<Redirect to="/" />
			)}
		</Route>
	);
};

export default PrivateRoute;
