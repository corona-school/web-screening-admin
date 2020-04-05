export const baseUrl = window.env
	? window.env.REACT_APP_BACKEND_URL
	: process.env.REACT_APP_BACKEND_URL || "http://localhost:3001/";

export const getJobs = "queue/jobs";
export const postChangeStatus = "student/changeJob";
export const login = "screener/login";
export const remove = "student/remove";
export const logout = "screener/logout";
export const getLoginStatus = "screener/status";
