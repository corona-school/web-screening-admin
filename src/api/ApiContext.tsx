import React from "react";
import { withRouter, RouteComponentProps } from "react-router-dom";
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
	databaseStatistics,
} from "./urls";
import { message, notification } from "antd";
import * as Sentry from "@sentry/browser";
import LogRocket from "logrocket";
import { isNotificationEnabled, notify } from "../utils/notification";

const ApiContext = React.createContext<IProviderProps | null>(null);
axios.defaults.withCredentials = true;

axios.defaults.timeout = 60 * 1000;

const socket = io(baseUrl, {
	reconnection: true,
	reconnectionDelay: 1000,
	reconnectionDelayMax: 5000,
	reconnectionAttempts: 99999,
});

export interface IJobInfo {
	firstname: string;
	lastname: string;
	email: string;
	subjects: ISubject[];
	phone?: string;
	birthday?: Date;
	msg?: string;
	screener?: IScreenerInfo;
	invited?: boolean;
	feedback?: string;
	knowcsfrom: string;
	commentScreener?: string;
	time: number;
	jitsi: string;
	status: Status;
	position?: number;
}

export type Status = "waiting" | "active" | "completed" | "rejected";

export interface IScreenerInfo {
	firstname: string;
	lastname: string;
	email: string;
	time: number;
}

export interface ISubject {
	subject: string;
	min: number;
	max: number;
}

export interface Screener {
	id: number;
	firstname: string;
	lastname: string;
	email: string;
}

export interface ISocketScreener {
	firstname: string;
	lastname: string;
	email: string;
	status: boolean;
}

export interface Student {
	firstname: string;
	lastname: string;
	email: string;
}

export interface IProviderProps {
	getJobsCall: () => void;
	studentData: IJobInfo[];
	checkLoginStatus: () => void;
	postChangeStatusCall: (job: IJobInfo) => Promise<any>;
	userIsLoggedIn: boolean;
	setUserIsLoggedIn: (isLoggedIn: boolean) => void;
	loginCall: (data: { email: string; password: string }) => void;
	logoutCall: () => void;
	user: IScreenerInfo | null;
	setUser: (user: IScreenerInfo) => void;
	handleRemoveJob: (email: string) => void;
	screenerOnline: ISocketScreener[];
	setScreenerOnline: (list: ISocketScreener[]) => void;
	isSocketConnected: boolean;
	isScreenerListOpen: boolean;
	setScreenerListOpen: (isOpen: boolean) => void;
	active: boolean;
	setActive: (isActive: boolean) => void;
	status: ScreenerStatus;
}

export enum ScreenerStatus {
	ONLINE = "online",
	OFFLINE = "offline",
	RECONNECTING = "reconnect",
}

export interface State {
	userIsLoggedIn: boolean;
	studentData: IJobInfo[];
	isSocketConnected: boolean;
	screenerOnline: ISocketScreener[];
	user: IScreenerInfo | null;
	isScreenerListOpen: boolean;
	active: boolean;
	status: ScreenerStatus;
}

class ApiContextComponent extends React.Component<RouteComponentProps> {
	state: State = {
		userIsLoggedIn: false,
		studentData: [],
		isSocketConnected: false,
		screenerOnline: [],
		isScreenerListOpen: false,
		user: null,
		status: ScreenerStatus.OFFLINE,
		active: localStorage.getItem("active")
			? localStorage.getItem("active") === "true"
			: true,
	};

	componentDidMount() {
		axios.interceptors.response.use(
			(response) => response,
			(error) => {
				if (error.response.status === 401) {
					this.setState({ userIsLoggedIn: false, user: null });
					this.props.history.push("/");
				}

				return Promise.reject(error);
			}
		);
		socket.on("connect", () => {
			this.setState({ isSocketConnected: true, status: ScreenerStatus.ONLINE });
		});

		socket.on("updateQueue", (queue?: IJobInfo[]) => {
			if (queue) {
				const oldWaitingJobs = this.state.studentData.filter(
					(j) => j.status === "waiting"
				).length;
				const newJobWaitings = queue.filter((j) => j.status === "waiting")
					.length;
				if (
					newJobWaitings > oldWaitingJobs &&
					isNotificationEnabled &&
					this.state.userIsLoggedIn
				) {
					notify();
				}
				this.setState({ studentData: queue });
			}
		});

		socket.on("screenerUpdate", (data?: ISocketScreener[]) => {
			if (data) {
				this.setState({ screenerOnline: data });
			}
		});
		socket.on("disconnect", () => {
			this.setState({
				isSocketConnected: false,
				status: ScreenerStatus.OFFLINE,
			});
		});

		socket.on("connect_error", (error: Error) => {
			Sentry.captureException(error);
			this.setState({ status: ScreenerStatus.OFFLINE });
			console.log("connect_error", error.message);
		});
		socket.on("error", (error: Error) => {
			Sentry.captureException(error);
			this.setState({ status: ScreenerStatus.OFFLINE });
			console.log("error", error.message);
		});
		socket.on("reconnecting", (attemptNumber: number) => {
			console.log("reconnecting", attemptNumber);
			this.setState({ status: ScreenerStatus.RECONNECTING });
			if (attemptNumber % 5 === 0) {
				notification.warning({
					message: "Verbindungsprobleme",
					description:
						"Du scheinst Verbindungsprobleme zu haben. Damit dieses Problem nicht auftritt, benutz bitte Chrome in der neusten Version auf einem Laptop/PC.",
				});
			}
		});
		socket.on("reconnect", () => {
			console.log("reconnected");
			socket.emit("screener-reconnect", this.state.user);
		});
		socket.on("connect_timeout", (data: any) => {
			this.setState({ status: ScreenerStatus.OFFLINE });
			console.log("connect_timeout", data.message);
		});
	}

	componentWillUnmount() {
		socket.close();
	}

	loginCall = (data: { email: string; password: string }) => {
		axios
			.post(baseUrl + login, data)
			.then(({ data }) => {
				this.setState({ userIsLoggedIn: true, user: data });
				if (this.state.isSocketConnected) {
					socket.emit("loginScreener", data);
				}
				Sentry.configureScope((scope) => {
					scope.setUser({ email: data.email, id: data.email });
					scope.setTag("user", data.email);
				});
				LogRocket.identify("user", {
					name: data.firstname + " " + data.lastname,
					email: data.email,
					subscriptionType: "screener",
				});
				this.props.history.push("/screening");
			})
			.catch((err) => {
				message.error("Du konntest nicht eingelogt werden.");
				console.log("login Failed", err);
			});
	};

	logoutCall = () => {
		const { user } = this.state;
		axios
			.get(baseUrl + logout)
			.then(() => {
				this.setState({ userIsLoggedIn: false, user: null });
				if (this.state.isSocketConnected) {
					socket.emit("logoutScreener", user);
				}
				this.props.history.push("/");
			})
			.catch((err) => {
				console.error("Logout Failed", err);
			});
	};

	handleRemoveJob = (email: string) => {
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

	getDatabaseStats = () => {
		axios
			.get(baseUrl + databaseStatistics)
			.then(({ data }) => {
				this.setState({ statistics: data });
			})
			.catch((err) => {
				console.log("Get Database Stats failed.", err);
			});
	};

	checkLoginStatus = () => {
		return axios.get(baseUrl + getLoginStatus);
	};

	postChangeStatusCall = (data: IJobInfo) => {
		return axios.post(baseUrl + postChangeStatus, data);
	};

	setActive = (isActive: boolean) => {
		if (this.state.isSocketConnected && this.state.user) {
			localStorage.setItem("active", isActive.toString());
			this.setState({ active: isActive });
			const data = {
				firstname: this.state.user.firstname,
				lastname: this.state.user.lastname,
				email: this.state.user.email,
				status: isActive,
			};
			socket.emit("screenerStatus", data);
		}
	};

	render() {
		const value: IProviderProps = {
			getJobsCall: this.getJobsCall,
			studentData: this.state.studentData,
			checkLoginStatus: this.checkLoginStatus,
			postChangeStatusCall: this.postChangeStatusCall,
			userIsLoggedIn: this.state.userIsLoggedIn,
			setUserIsLoggedIn: (loggedIn: boolean) =>
				this.setState({ userIsLoggedIn: loggedIn }),
			loginCall: this.loginCall,
			logoutCall: this.logoutCall,
			user: this.state.user,
			setUser: (user: IScreenerInfo) => {
				this.setState({ user });
				if (this.state.isSocketConnected && user) {
					socket.emit("loginScreener", user);
				}
			},
			handleRemoveJob: this.handleRemoveJob,

			screenerOnline: this.state.screenerOnline,
			setScreenerOnline: (list: ISocketScreener[]) =>
				this.setState({ screenerOnline: list }),
			isSocketConnected: this.state.isSocketConnected,
			isScreenerListOpen: this.state.isScreenerListOpen,
			setScreenerListOpen: (value: boolean) =>
				this.setState({ isScreenerListOpen: value }),
			active: this.state.active,
			setActive: this.setActive,
			status: this.state.status,
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
