import React from "react";
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

const socket = io(baseUrl);

class ApiContextComponent extends React.Component {
	state = {
		userIsLoggedIn: false,
		studentData: [],
		selectedJob: null,
		isSocketConnected: false,
		screenerOnline: [],
		isScreenerListOpen: false,
		user: null,
	};

	componentDidMount() {
		socket.on("connect", () => {
			this.setState({ isSocketConnected: true });
		});

		socket.on("updateQueue", (queue) => {
			if (queue) {
				this.setState({ studentData: queue });
			}
		});
		socket.on("screenerUpdate", (data) => {
			if (data) {
				this.setState({ screenerOnline: data });
			}
		});
		socket.on("disconnect", () => {
			this.setState({ isSocketConnected: false });
			socket.close();
		});
	}

	componentWillUnmount() {
		socket.close();
	}

	loginCall = (data) => {
		axios
			.post(baseUrl + login, data)
			.then(({ data }) => {
				this.setState({ userIsLoggedIn: true, user: data });
				if (this.state.isSocketConnected) {
					socket.emit("loginScreener", data);
				}
				this.props.history.push("/screening");
			})
			.catch((err) => {
				message.error("Du konntest nicht eingelogt werden.");
				console.log("login Failed", err);
			});
	};

	logoutCall = () => {
		axios
			.get(baseUrl + logout)
			.then(() => {
				this.setState({ userIsLoggedIn: false, user: null });
				this.props.history.push("/");
			})
			.catch((err) => {
				console.error("Logout Failed", err);
			});
	};

	handleRemoveJob = (email) => {
		axios
			.post(baseUrl + remove, { email })
			.then(() => message.success("Job wurde erfolgreich entfernt!"))
			.catch(() => message.error("Job konnte nicht entfernt werden."));
	};

	getJobsCall = () => {
		axios
			.get(baseUrl + getJobs)
			.then(({ data }) => {
				this.setState({ studentData: data });
			})
			.catch((err) => {
				console.log("Get Jobs failed.", err);
			});
	};

	checkLoginStatus = () => {
		return axios.get(baseUrl + getLoginStatus);
	};

	postChangeStatusCall = (data) => {
		return axios.post(baseUrl + postChangeStatus, data);
	};
	render() {
		const value = {
			getJobsCall: this.getJobsCall,
			studentData: this.state.studentData,
			checkLoginStatus: this.checkLoginStatus,
			postChangeStatusCall: this.postChangeStatusCall,
			userIsLoggedIn: this.state.userIsLoggedIn,
			setUserIsLoggedIn: (loggedIn) =>
				this.setState({ userIsLoggedIn: loggedIn }),
			loginCall: this.loginCall,
			logoutCall: this.logoutCall,
			user: this.state.user,
			setUser: (user) => {
				this.setState({ user });
				if (this.state.isSocketConnected && user) {
					socket.emit("loginScreener", user);
				}
			},
			handleRemoveJob: this.handleRemoveJob,
			selectedJob: this.state.selectedJob,
			setSelectedJob: (job) => this.setState({ selectedJob: job }),
			screenerOnline: this.state.screenerOnline,
			setScreenerOnline: (list) => this.setState({ screenerOnline: list }),
			isSocketConnected: this.state.isSocketConnected,
			isScreenerListOpen: this.state.isScreenerListOpen,
			setScreenerListOpen: (value) =>
				this.setState({ isScreenerListOpen: value }),
		};
		return (
			<ApiContext.Provider value={value}>
				{this.props.children}
			</ApiContext.Provider>
		);
	}
}

export default withRouter(ApiContextComponent);
export { ApiContext };
