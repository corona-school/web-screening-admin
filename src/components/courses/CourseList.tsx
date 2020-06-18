import React from "react";
import "./CourseList.less";
import Queue from "./Queue"

const CourseList = () => {
    return (
        <div className="course-container">
            <Queue />
        </div>
    );
};

export default CourseList;