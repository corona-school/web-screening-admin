import { useState, useEffect, useRef } from 'react';
import {
  CourseState,
  ApiCourseUpdate,
  Course,
  CourseTag,
} from '../types/Course';
import Axios from 'axios';
import { baseUrl } from './urls';

interface Query {
  search?: string;
  courseState?: CourseState;
  page?: number;
}
export default function useCourses({ initial }: { initial: CourseState }) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseTags, setCourseTags] = useState<CourseTag[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const previousState = useRef<Query>({
    courseState: initial,
    search: undefined,
    page: undefined,
  });

  async function loadCourses(query: Query) {
    if (
      previousState.current.courseState !== query.courseState ||
      previousState.current.page !== query.page ||
      previousState.current.search !== query.search
    ) {
      /* Hide the loading spinner if we only refresh the courses */
      setCourses([]);
      setLoading(true);
    }
    previousState.current = query;

    const {
      status,
      data: { courses },
    } = await Axios.get(`${baseUrl}courses`, { params: query });

    if (status !== 200)
      throw new Error(`Failed to fetch courses with status ${status}`);

    console.log('loaded courses', courses);
    setCourses(courses);
    setLoading(false);
  }

  async function loadCourseTags() {
    setCourseTags([]);
    setLoading(true);
    const {
      status,
      data: { courseTags },
    } = await Axios.get(`${baseUrl}courses/tags`);

    if (status !== 200)
      throw new Error(`Failed to fetch course tags with status ${status}`);

    setCourseTags(courseTags);
    setLoading(false);
  }

  /* Calls the API to update the course, then updates the course list */
  async function updateCourse({ id }: Course, update: ApiCourseUpdate) {
    const before = courses;

    // Remove this to update silently:
    setCourses([]);
    setLoading(true);

    const {
      status,
      data: { course },
    } = await Axios.post(`${baseUrl}course/${id}/update`, update);

    if (status !== 200)
      throw new Error(`Failed to update course ${id} with status ${status}`);

    setLoading(false);
    setCourses(before.map((it) => (it.id === course.id ? course : it)));
  }

  // Initially load all courses
  useEffect(() => {
    loadCourses({ courseState: initial });
  }, [initial]);

  return {
    courses,
    courseTags,
    loading,
    loadCourses,
    loadCourseTags,
    updateCourse,
  };
}
