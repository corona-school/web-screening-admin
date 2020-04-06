import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import io from "socket.io-client";
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
	const [isSocketConnected, setSocketConnected] = useState(false);
	const [screenerOnline, setScreenerOnline] = useState([]);
	const [isScreenerListOpen, setScreenerListOpen] = useState(false);
	const [user, setUser] = useState(null);

	const socket = io(baseUrl);

	useEffect(() => {
		if (
			selectedJob &&
			studentData.every((job) => job.email !== selectedJob.email)
		) {
			setSelectedJob(null);
			message.error(
				"Stundent konnte nicht mehr in der Warteschlange gefunden werden."
			);
		}
	}, [studentData, selectedJob]);

	// useEffect(() => {
	// 	if (userIsLoggedIn && user) {
	// 		socket.on("connect", () => {
	// 			setSocketConnected(true);
	// 			console.log("connected");
	// 			socket.emit("loginScreener", user);
	// 		});
	// 		socket.on("updateQueue", (queue) => {
	// 			if (queue) {
	// 				setStudentData(queue);
	// 			}
	// 		});
	// 		socket.on("screenerUpdate", (data) => {
	// 			if (data) {
	// 				setScreenerOnline(data);
	// 			}
	// 		});
	// 		socket.on("disconnect", () => {
	// 			setSocketConnected(false);
	// 		});
	// 	}
	// }, [userIsLoggedIn, user]);

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
		if (isSocketConnected) {
			socket.emit("logoutScreener", user);
		}
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
		return axios.post(baseUrl + postChangeStatus, data);
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
				screenerOnline,
				setScreenerOnline,
				isSocketConnected,
				isScreenerListOpen,
				setScreenerListOpen,
			}}>
			{children}
		</ApiContext.Provider>
	);
};

export default withRouter(ApiContextComponent);
export { ApiContext };
