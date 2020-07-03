import { useState, useEffect } from "react";
import { CourseState, ApiCourseUpdate, Course } from "../types/Course";
import Axios from "axios";
import { baseUrl } from "./urls";


export default function useCourses({ initial }: { initial: CourseState }) {
    const [{ courses, loading }, setState] = useState<{ courses: Course[], loading: boolean }>({ courses: [], loading: true });

    async function loadCourses(query: { search?: string, courseState?: CourseState }) {
        setState({ loading: true, courses: [] });
        const { status, data: { courses } } = await Axios.get(`${baseUrl}courses`, { params: query });

        if(status !== 200)
            throw new Error(`Failed to fetch courses with status ${status}`);

        console.log("loaded courses", courses);
        setState({ loading: false, courses });
    }

    /* Calls the API to update the course, then updates the course list */
    async function updateCourse({ id }: Course, update: ApiCourseUpdate) {
        const before = courses;

        // Remove this to update silently:
        setState({ loading: true, courses: [] });

        const { status, data: { course } } = await Axios.post(`${baseUrl}course/${id}/update`, update);

        if(status !== 200)
            throw new Error(`Failed to update course ${id} with status ${status}`);

        setState({
            loading: false,
            courses: before.map(it => it.id === course.id ? course : it)
        });
    }

    // Initially load all courses
    useEffect(() => { loadCourses({ courseState: initial }) }, [initial]);

    return { courses, loading, loadCourses, updateCourse };
}