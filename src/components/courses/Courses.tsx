import React, { useState } from "react";
import { Tabs, Table } from "antd";
import Title from "antd/lib/typography/Title";
import ClipLoader from "react-spinners/ClipLoader";

import "./Courses.less";
import { CourseState } from "../../types/Course";

import useCourses from "../../api/useCourses";


const courseStates: { [key in CourseState]: string } = {
    submitted: "Prüfen",
    allowed: "Angenommen",
    created: "Erstellt",
    denied: "Abgelehnt",
    cancelled: "Gecancelled",
};

const columns = [
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
    },
];

const Courses = () => {
    const [courseState, _setCourseState] = useState("submitted" as CourseState);
    
    const { courses, loadCourses, loading, updateCourse } = useCourses();

    function setCourseState(courseState: CourseState) {
        _setCourseState(courseState);
        loadCourses({ courseState });
    }
    
    return (
        <div className="course-container">
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
                            {loading && <ClipLoader size={120} color={"#25b864"} loading={true} />}
                            {!loading && <Table columns={columns} dataSource={courses}></Table>}
                        </Tabs.TabPane>
                    );
                })}
            </Tabs>
        </div>
        </div>
    );
};

export default Courses;