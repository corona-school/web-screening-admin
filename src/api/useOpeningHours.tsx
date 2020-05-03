import { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl, openingHoursPath } from "./urls";

export interface ITime {
	from: string;
	to: string;
}

export interface IOpeningHours {
	Monday: {
		times: ITime[];
	};
	Tuesday: {
		times: ITime[];
	};
	Wednesday: {
		times: ITime[];
	};
	Thursday: {
		times: ITime[];
	};
	Friday: {
		times: ITime[];
	};
	Saturday: {
		times: ITime[];
	};
	Sunday: {
		times: ITime[];
	};
}

const useOpeningHours = () => {
	const [openingHours, setOpeningHours] = useState<IOpeningHours | null>(null);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		setLoading(true);
		axios
			.get(baseUrl + openingHoursPath)
			.then(({ data }) => {
				setLoading(false);
				setOpeningHours(data);
			})
			.catch((err) => {
				setLoading(false);
				console.log("Get Database Stats failed.", err);
			});
	}, []);

	return { openingHours, loading, setOpeningHours };
};

export default useOpeningHours;
