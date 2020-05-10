export const baseUrl = (window as any).env
	? (window as any).env.REACT_APP_BACKEND_URL
	: process.env.REACT_APP_BACKEND_URL || "http://localhost:3001/";

export const getJobs = "queue/jobs";
export const postChangeStatus = "student/changeJob";
export const login = "screener/login";
export const studentInfoPath = "student";
export const studentManualVerification = "student/verify";
export const remove = "student/remove";
export const openingHoursPath = "openingHours";
export const logout = "screener/logout";
export const getLoginStatus = "screener/status";
export const queueStatistic = "queue/statistics";
export const databaseStatistics = "statistics/logs";
