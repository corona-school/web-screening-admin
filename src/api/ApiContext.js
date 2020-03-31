import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import {
	baseUrl,
	getJobs,
	login,
	logout,
	postChangeStatus,
	postVerifyStudent,
	getLoginStatus
} from "./urls.js";

const ApiContext = React.createContext();
axios.defaults.withCredentials = true;

const ApiContextComponent = ({ children, history }) => {
	const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
	const [studentData, setStudentData] = useState([]);

	const loginCall = data => {
		axios
			.post(baseUrl + login, data)
			.then(resp => {
				console.log(resp);

				setUserIsLoggedIn(true);
				history.push("/screening");
			})
			.catch(err => {
				console.log("login Failed", err);
			});
	};

	const logoutCall = () => {
		axios
			.get(baseUrl + logout)
			.then(() => {
				setUserIsLoggedIn(false);
				history.push("/");
			})
			.catch(err => {
				console.error("Logout Failed", err);
			});
	};

	const getJobsCall = () => {
		axios
			.get(baseUrl + getJobs)
			.then(({ data }) => {
				const jobs = data.map(job => ({
					firstname: job.firstname,
					lastname: job.lastname,
					email: job.lastname,
					status: job.status,
					jitsi: job.jitsi,
					time: job.time,
					comment: job.comment || "",
					feedback: job.feedback || "",
					classes: job.classes || []
				}));
				setStudentData(jobs);
			})
			.catch(err => {
				console.log("Get Jobs failed.", err);
			});
	};

	const checkLoginStatus = () => {
		return axios.get(baseUrl + getLoginStatus);
	};

	const postChangeStatusCall = data => {
		axios
			.post(baseUrl + postChangeStatus, data)
			.then(resp => console.log(resp))
			.catch(err => console.error(err));
	};

	const postVerifyStudentCall = data => {
		axios
			.post(baseUrl + postVerifyStudent, data)
			.then(getJobsCall())
			.catch(err => console.error(err));
	};

	return (
		<ApiContext.Provider
			value={{
				getJobsCall,
				studentData,
				checkLoginStatus,
				postChangeStatusCall,
				postVerifyStudentCall,
				userIsLoggedIn,
				setUserIsLoggedIn,
				loginCall,
				logoutCall
			}}>
			{children}
		</ApiContext.Provider>
	);
};

export default withRouter(ApiContextComponent);
export { ApiContext };
