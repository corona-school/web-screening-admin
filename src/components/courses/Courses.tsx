import React, { useState } from "react";
import { Tabs, Table, Tag } from "antd";
import Title from "antd/lib/typography/Title";
import ClipLoader from "react-spinners/ClipLoader";

import "./Courses.less";
import { CourseState, Course, ApiCourseUpdate, CourseCategory } from "../../types/Course";

import useCourses from "../../api/useCourses";
import { Student } from "../../api";


const courseStates: { [key in CourseState]: string } = {
    submitted: "Prüfen",
    allowed: "Angenommen",
    created: "Erstellt",
    denied: "Abgelehnt",
    cancelled: "Gecancelled",
};



const Courses = () => {
    const [courseState, _setCourseState] = useState<CourseState>(CourseState.SUBMITTED);
    const [editCourse, setEditCourse] = useState<Course | null>(null);

    const { courses, loadCourses, loading, updateCourse } = useCourses();

    function setCourseState(courseState: CourseState) {
        _setCourseState(courseState);
        loadCourses({ courseState });
    }

    return <div className="course-container">
        {editCourse && <UpdateCourse course={editCourse} updateCourse={updateCourse} close={() => setEditCourse(null)} />}
        {!editCourse && <CourseTable courseState={courseState} courses={courses} loading={loading} setCourseState={setCourseState} setEditCourse={setEditCourse} />}
    </div>
}

function CourseTable({ courseState, setCourseState, courses, loading, setEditCourse }: { courseState: CourseState, setCourseState(courseState: CourseState): void, courses: Course[], loading: boolean, setEditCourse(course: Course): void }) {

    const columns = [
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Autoren",
            dataIndex: "instructors",
            key: "instructors",
            render: (instructors: Student[]) => instructors.map(instructor => instructor.firstname + " " + instructor.lastname).join(", ") || "-",
        },
        {
            title: "Erstellungsdatum",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (createdAt: string) => new Date(createdAt).toLocaleDateString(),
        },
        {
            title: "Aktionen",
            dataIndex: "actions",
            render: (_: any, course: Course) => <Tag color="volcano" onClick={() => setEditCourse(course)}>Bearbeiten</Tag>
        }
    ];
    
    return (
            <div className={"queue"}>
            <div className={"header"}>
                <Title style={{ color: "#6c757d", marginTop: 0 }} level={4}>
                    Kurse
                </Title>
            </div>
            <Tabs
                defaultActiveKey={`submitted`}
                activeKey={courseState}
                onChange={k => setCourseState(k as CourseState)}>
                {Object.keys(courseStates).map((courseState) => {
                    return (
                        <Tabs.TabPane tab={courseStates[courseState as CourseState]} key={courseState}>
                            <Table loading={loading} columns={columns} dataSource={courses}></Table>
                        </Tabs.TabPane>
                    );
                })}
            </Tabs>
        </div>
        
    );
};

function UpdateCourse({ course, updateCourse, close }: { course: Course, updateCourse(course: Course, update: ApiCourseUpdate): Promise<void>, close(): void }) {
    const [name, setName] = useState(course.name);
    const [outline, setOutline] = useState(course.outline);
    const [description, setDescription] = useState(course.description);
    const [category, setCategory] = useState<CourseCategory>(course.category);
    const [imageUrl, setImageUrl] = useState(course.imageUrl);

    function update(courseState: CourseState.ALLOWED | CourseState.CANCELLED | CourseState.DENIED | undefined) {
        updateCourse(course, {
            category, courseState, description, imageUrl, name, outline
        }).then(close);
    }

    return <div>
        Name: <input value={name} onChange={e => setName(e.target.value)} />
        (viele weitere Inputs)
        <button onClick={() => update(CourseState.ALLOWED)}>Speichern und Annehmen</button>
        <button onClick={() => update(CourseState.DENIED)}>Speichern und Ablehnen</button>
        <button onClick={() => close()}>Abbrechen</button>
    </div>;
}


export default Courses;