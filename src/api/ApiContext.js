import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import {
	baseUrl,
	getJobs,
	login,
	logout,
	postChangeStatus,
	getLoginStatus
} from "./urls.js";

const ApiContext = React.createContext();
axios.defaults.withCredentials = true;

const ApiContextComponent = ({ children, history }) => {
	const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
	const [studentData, setStudentData] = useState([]);
	const [user, setUser] = useState(null);

	const loginCall = data => {
		axios
			.post(baseUrl + login, data)
			.then(({ data }) => {
				setUserIsLoggedIn(true);
				setUser(data);
				console.log(data);

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
				setUser(null);
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
				setStudentData(data);
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
				setUser
			}}>
			{children}
		</ApiContext.Provider>
	);
};

export default withRouter(ApiContextComponent);
export { ApiContext };
