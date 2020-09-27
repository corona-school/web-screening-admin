import React, {useState, useEffect, ReactNode} from "react";
import {Button, Tabs, Table, Tag, Space, Card, Descriptions, Input, Dropdown, Menu, AutoComplete} from "antd";
import Title from "antd/lib/typography/Title";
import { ArrowLeftOutlined, FileTextOutlined, CalendarOutlined, UserOutlined, EditOutlined, DownOutlined, TagOutlined, PlusOutlined} from "@ant-design/icons/lib";

import "./Courses.less";
import {
    CourseState,
    Course,
    ApiCourseUpdate,
    CourseCategory,
    CourseTag,
    Lecture,
    ApiAddLecture
} from "../../types/Course";

import useCourses from "../../api/useCourses";
import useInstructors, { Instructor } from "../../api/useInstructors";
// import { Student } from "../../api";
import { Student, ScreeningStatus } from "../../types/Student";
import useDebounce from "../../utils/useDebounce";
import Select, { SelectProps } from "antd/lib/select";
import { SearchProps } from "antd/lib/input";
import InstructorSelector from "./InstructorSelector";
import moment from "moment";
import LectureEditor from "./LectureEditor";

const { Option } = Select;

const { TextArea } = Input;

const courseStates: { [key in CourseState]: string } = {
    submitted: "Prüfen",
    allowed: "Angenommen",
    created: "Erstellt",
    denied: "Abgelehnt",
    cancelled: "Gecancelled",
};

const categoryName: { [key in CourseCategory]: string } = {
    club: "AG",
    revision: "Repetitorium",
    coaching: "Lern-Coaching"
}


const Courses = () => {
    const [courseState, setCourseState] = useState<CourseState>(CourseState.SUBMITTED);
    const [_search, setSearch] = useState("");
    const search = useDebounce(_search);

    const [editCourse, setEditCourse] = useState<Course | null>(null);

    const { courses, loadCourses, loading, updateCourse } = useCourses({ initial: CourseState.SUBMITTED });

    useEffect(() => {
        loadCourses({ courseState, search });
    }, [courseState, search]);

    return <div className="course-container">
        {editCourse && <UpdateCourse course={editCourse} updateCourse={updateCourse} close={() => setEditCourse(null)} />}
        {!editCourse && <CourseTable courseState={courseState} courses={courses} loading={loading} setCourseState={setCourseState} setEditCourse={setEditCourse} setSearch={setSearch} />}
    </div>
}

function CourseTable({ courseState, setCourseState, courses, loading, setEditCourse, setSearch }: { courseState: CourseState, setCourseState(courseState: CourseState): void, courses: Course[], loading: boolean, setEditCourse(course: Course): void, setSearch(search: string): void }) {

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
            title: "Tags",
            dataIndex: "tags",
            key: "tags",
            render: (tags: CourseTag[]) => tags?.map(tag => <Tag>{tag.name}</Tag>)
        },
        {
            title: "Erstellungsdatum",
            dataIndex: "createdAt",
            key: "createdAt",
            render: (createdAt: string) => new Date(createdAt).toLocaleDateString(),
        }
    ];

    const rowClassName = (record: Course) => {
        if(record.courseState === courseState)
            return '';

        if(record.courseState === CourseState.ALLOWED)
            return 'green';

        if(record.courseState === CourseState.DENIED)
            return 'red';

        return '';
    };

    const onSearch = (event: { target: { value: string; }; }) => {
        setSearch(event.target.value);
    };

    const searchField = <Input
        size="large"
        style={{ width: "400px" }}
        placeholder="Suche nach Name oder Beschreibung"
        allowClear
        onChange={onSearch}
    />;

    return (
        <div className="queue">
            <div className="header">
                <Title style={{ color: "#6c757d", marginTop: 0 }} level={4}>
                    Kurse
                </Title>
            </div>
            <Tabs
                tabBarExtraContent={searchField}
                defaultActiveKey={`submitted`}
                activeKey={courseState}
                onChange={k => setCourseState(k as CourseState)}>
                {Object.keys(courseStates).map((courseState) => {
                    return (
                        <Tabs.TabPane tab={courseStates[courseState as CourseState]} key={courseState}>
                            <Table rowClassName={rowClassName} loading={loading} columns={columns} dataSource={courses} onRow={record => ({ onClick() { setEditCourse(record); }})} className="hover"></Table>
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
    const [screeningComment, setScreeningComment] = useState(course.screeningComment);
    const [instructors, setInstructors] = useState<Instructor[]>(course.instructors ?? []);
    const [isEditMode, setIsEditMode] = useState(false);
    const [newLectures, setNewLectures] = useState<ApiAddLecture[]>([]);
    const [removeLectures, setRemoveLectures] = useState<Lecture[]>([]);

    const isEdited =
        name !== course.name ||
        outline !== course.outline ||
        description !== course.description ||
        category !== course.category ||
        imageUrl !== course.imageUrl;


    function update(courseState: CourseState.ALLOWED | CourseState.CANCELLED | CourseState.DENIED | undefined) {
        updateCourse(course, {
            category, courseState, description, imageUrl, name, outline, screeningComment, instructors, newLectures, removeLectures
        }).then(close);
    }


    const Header = () => {
        return (
            <div className="course-header">
                <Space size="large" style={{ width: "100%"}}>
                    <Button onClick={() => (!isEdited || window.confirm("Willst du die Änderungen verwerfen?")) && close()} icon={<ArrowLeftOutlined />}/>

                    { !isEditMode && <Title style={{ color: "#6c757d"}} level={4}>{name}</Title> }
                    { isEditMode && <Input style={{ width: "100%"}} size="large" value={ name } className = "" onChange={ e => setName(e.target.value) } /> }

                </Space>
                {!isEditMode && <Space size="small">
                    {course.courseState !== "allowed" && <Button onClick={() => update(CourseState.ALLOWED)} style={{ background: "#B5F1BB" }}>
                        Annehmen
                    </Button>}
                    {course.courseState !== "denied" && <Button onClick={() => update(CourseState.DENIED)} style={{ background: "#F5AFAF" }}>
                        Ablehnen
                    </Button>}
                    <Button onClick={() => setIsEditMode(true)} icon={<EditOutlined />}/>
                </Space>}

                {isEditMode && <Space size="small">
                    <Button onClick={ () => update(undefined)}
                            style={{ background: "#C4C4C4", color: "#FFFFFF"}}>
                        Speichern
                    </Button>
                    {course.courseState !== "allowed" && <Button onClick={() => update(CourseState.ALLOWED)} style={{ background: "#B5F1BB" }}>
                        Speichern und Annehmen
                    </Button>}
                    {course.courseState !== "denied" && <Button onClick={() => update(CourseState.DENIED)} style={{ background: "#F5AFAF" }}>
                        Speichern und Ablehnen
                    </Button>}
                </Space>}

            </div>
        );
    };

    const CourseDetails = () => {
        const categoryMenu = (
            <Menu>
                {Object.entries(categoryName)
                    .map(([category, name]) =>
                        <Menu.Item onClick={() => setCategory(category as CourseCategory)}>
                                {name}
                        </Menu.Item>
                )}


            </Menu>
        );

        return (
            <div className="course-details">
                <Card title={ <><FileTextOutlined /> Kurzbeschreibung:</> }>
                    { !isEditMode && outline }
                    { isEditMode && <TextArea value={ outline }
                                              onChange={(e) => setOutline(e.target.value)}/>
                    }
                </Card>
                <br/>
                <Card title={ <><FileTextOutlined /> Beschreibung:</> }>
                    { !isEditMode && description }
                    { isEditMode && <TextArea value={ description }
                                              onChange={(e) => setDescription(e.target.value) }/>
                    }
                </Card>
                <br/>
                <Card title={<><FileTextOutlined /> Kategorie: </>}>
                    {!isEditMode && categoryName[category]}
                    {isEditMode && <Dropdown.Button overlay={categoryMenu} icon={<DownOutlined />}>
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            {categoryName[category]}
                        </a>
                    </Dropdown.Button>}
                </Card>
                <br/>
                <Card title={<><CalendarOutlined /> Kurszeiten: </>}>
                    {!isEditMode && (
                        course.subcourses ? course.subcourses[0].lectures.map(l => {
                            const date = moment(l.start).format("DD.MM.YY");
                            const startTime = moment(l.start).format("HH:mm");
                            const endTime = moment(l.start).add(l.duration, "minutes").format("HH:mm");

                            return (<Tag>{`${date} ${startTime} - ${endTime}`}</Tag>)
                        }) : ""
                    )}
                    {isEditMode && (
                        course.subcourses ?
                            <LectureEditor currentLectures={course.subcourses[0].lectures}
                                           newLectures={newLectures}
                                           setNewLectures={setNewLectures}
                                           removeLectures={removeLectures}
                                           setRemoveLectures={setRemoveLectures}
                                           subcourse={course.subcourses[0]} />
                                           : ''
                    )}
                </Card>
                <br/>
                <Card title={ <><FileTextOutlined /> Kommentar:</> }>
                    { !isEditMode && screeningComment }
                    { isEditMode && <TextArea value={ screeningComment || "" }
                                              onChange={(e) => setScreeningComment(e.target.value)}/>
                    }
                </Card>
            </div>
        );
    };

    const MetaDetails = () => {

        return <div className="meta-details" >
            <Descriptions layout="vertical" column={1} bordered={true}>
                <Descriptions.Item label={ <><CalendarOutlined /> Erstellt am</> }>
                    { new Date(course.createdAt).toLocaleDateString() }
                </Descriptions.Item>
                <Descriptions.Item label={ <><CalendarOutlined /> Updated am</> }>
                    { new Date(course.updatedAt).toLocaleDateString() }
                </Descriptions.Item>
                <Descriptions.Item label={ <><UserOutlined /> Trainer</> }>
                    {!isEditMode && (course.instructors?.map(instructor => instructor.firstname + " " + instructor.lastname).join(", ") || "-")}
                    {isEditMode && <InstructorSelector instructors={instructors} setInstructors={setInstructors} />}

                </Descriptions.Item>
                <Descriptions.Item label={ <><TagOutlined /> Labels</> }>
                    {
                        course.tags?.map(tag => <Tag>{tag.name}</Tag>)
                    }
                </Descriptions.Item>
            </Descriptions>
        </div>;
    };

    return (
        <div className="update-course">
            { Header() }
            { CourseDetails() }
            { MetaDetails() }
        </div>
    );
}


export default Courses;