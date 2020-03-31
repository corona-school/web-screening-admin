import React, { useContext, useEffect, useState } from "react";
import { Route, Redirect } from "react-router-dom";
import { Layout } from "antd";
import ClipLoader from "react-spinners/ClipLoader";
import UserList from "../components/userList";
import { ApiContext } from "../api/ApiContext";
import "./PrivateRoute.less";

const { Content } = Layout;

const PrivateRoute = () => {
	const {
		userIsLoggedIn,
		setUserIsLoggedIn,
		checkLoginStatus,
		currentStudentKey,
		studentData
	} = useContext(ApiContext);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		checkLoginStatus()
			.then(() => {
				setUserIsLoggedIn(true);
				setLoading(false);
			})
			.catch(err => {
				console.error(err);

				setUserIsLoggedIn(false);
				setLoading(false);
			});
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
	);
};

export default PrivateRoute;
