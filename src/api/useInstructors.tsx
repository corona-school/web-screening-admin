import { useState, useEffect } from "react";
import Axios from "axios";
import { baseUrl } from "./urls";
import { ScreeningStatus, ApiScreeningResult } from "../types/Student";

export default function useInstructors({ initial }: { initial: ScreeningStatus }) {
    const [{ instructors, loading }, setState] = useState<{ instructors: any[], loading: boolean }>({ instructors: [], loading: true });

    async function loadInstructors(query: { screeningStatus: ScreeningStatus}) {
        setState({ loading: true, instructors: [] });
        const { status, data: { instructors } } = await Axios.get(`${baseUrl}instructors`, { params: query });

        if(status !== 200)
            throw new Error(`Failed to fetch instructors with status ${status}`);

        console.log("loaded instructors", instructors);
        setState({ loading: false, instructors });
    }

    /* Calls the API to update the instructor, then updates the instructor list */
    async function updateInstructor({ id }: any, update: ApiScreeningResult) {
        const before = instructors;

        // Remove this to update silently:
        setState({ loading: true, instructors: [] });

        const { status, data: { instructor, screening } } = await Axios.post(`${baseUrl}instructor/${id}/update`, update);

        if(status !== 200)
            throw new Error(`Failed to update instructor ${id} with status ${status}`);

        setState({
            loading: false,
            instructors: before.map(it => it.id === instructor.id ? instructor : it)
        });
    }

    // Initially load all courses
    useEffect(() => { loadInstructors({ screeningStatus: initial }) }, []);

    return { instructors, loading, loadInstructors, updateInstructor };
}