import { useState, useEffect } from "react";
import Axios from "axios";
import { baseUrl } from "./urls";
import { ScreeningStatus, ApiScreeningResult, Screening, Student } from "../types/Student";

type Instructor = Student & { __screening__: Screening };

export default function useInstructors({ initialStatus, initialSearch }: { initialStatus: ScreeningStatus, initialSearch: string }) {
    const [{ instructors, loading }, setState] = useState<{ instructors: Instructor[], loading: boolean }>({ instructors: [], loading: true });

    async function loadInstructors(query: { screeningStatus: ScreeningStatus, search: string }) {
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
            instructors: before.map(it => it.id === instructor.id ? { ...instructor, __screening__: screening } : it)
        });
    }

    // Initially load all courses
    useEffect(() => { loadInstructors({ screeningStatus: initialStatus, search: initialSearch }) }, []);

    return { instructors, loading, loadInstructors, updateInstructor };
}