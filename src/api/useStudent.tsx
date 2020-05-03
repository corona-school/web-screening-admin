import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl, studentInfoPath } from "./urls";

export interface IStudentInfo {
	firstname: string;
	lastname: string;
	email: string;
	subjects: string;
	phone?: string;
	msg?: string;
	verified?: boolean;
}

const useStatistics = (email: string) => {
	const [studentInfo, setStudentInfo] = useState<IStudentInfo | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		axios
			.get(baseUrl + studentInfoPath, { params: { email } })
			.then(({ data }) => {
				setLoading(false);
				setStudentInfo(data);
			})
			.catch((err) => {
				setLoading(false);
				console.log("Get Database Stats failed.", err);
			});
	}, []);

	return { studentInfo, loading };
};

export default useStatistics;
