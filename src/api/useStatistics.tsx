import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { baseUrl, databaseStatistics } from "./urls";
import { Screener, Student } from "./ApiContext";
import useInterval from "./interval";

export interface Statistic {
	id: number;
	createdAt: string;
	finnishedAt: string;
	completed: boolean;
	screenerEmail: string;
	studentEmail: string;
	screener: Screener;
	student: Student;
}
interface Result {
	statistics: Statistic[];
	loading: boolean;
}

const useStatistics = () => {
	const [statistics, setStatistics] = useState<Statistic[]>([]);
	const [loading, setLoading] = useState(false);

	const fetchData = () => {
		axios
			.get(baseUrl + databaseStatistics)
			.then(({ data }) => {
				setLoading(false);
				setStatistics(data);
			})
			.catch((err) => {
				setLoading(false);
				console.log("Get Database Stats failed.", err);
			});
	};

	useEffect(() => {
		fetchData();
	}, []);

	useInterval(() => {
		fetchData();
	}, 5000);

	return { statistics, loading };
};

export default useStatistics;
