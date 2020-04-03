import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import {
	baseUrl,
	getJobs,
	login,
	logout,
	postChangeStatus,
	getLoginStatus,
	remove,
} from "./urls.js";
import { message } from "antd";

const ApiContext = React.createContext();
axios.defaults.withCredentials = true;

const ApiContextComponent = ({ children, history }) => {
	const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);

	const [studentData, setStudentData] = useState([]);
	const [selectedJob, setSelectedJob] = useState(null);
	const [user, setUser] = useState(null);

	const loginCall = (data) => {
		axios
			.post(baseUrl + login, data)
			.then(({ data }) => {
				setUserIsLoggedIn(true);
				setUser(data);
				console.log(data);

				history.push("/screening");
			})
			.catch((err) => {
				console.log("login Failed", err);
			});
	};

	const logoutCall = () => {
		axios
			.get(baseUrl + logout)
			.then(() => {
				setUserIsLoggedIn(false);
				setUser(null);
				history.push("/");
			})
			.catch((err) => {
				console.error("Logout Failed", err);
			});
	};

	const handleRemoveJob = (email) => {
		axios
			.post(baseUrl + remove, { email })
			.then((resp) => message.success("Job wurde erfolgreich entfernt!"))
			.catch((err) => message.error("Job konnte nicht entfernt werden."));
	};

	const getJobsCall = () => {
		axios
			.get(baseUrl + getJobs)
			.then(({ data }) => {
				setStudentData(data);
			})
			.catch((err) => {
				console.log("Get Jobs failed.", err);
			});
	};

	const checkLoginStatus = () => {
		return axios.get(baseUrl + getLoginStatus);
	};

	const postChangeStatusCall = (data) => {
		axios
			.post(baseUrl + postChangeStatus, data)
			.then((resp) =>
				message.success("Änderungen wurden erfolgreich gespeichert.")
			)
			.catch((err) =>
				message.error("Änderungen konnten nicht gespeichert werden")
			);
	};

	return (
		<ApiContext.Provider
			value={{
				getJobsCall,
				studentData,
				checkLoginStatus,
				postChangeStatusCall,
				userIsLoggedIn,
				setUserIsLoggedIn,
				loginCall,
				logoutCall,
				user,
				setUser,
				handleRemoveJob,
				selectedJob,
				setSelectedJob,
			}}>
			{children}
		</ApiContext.Provider>
	);
};

export default withRouter(ApiContextComponent);
export { ApiContext };
