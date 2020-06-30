import React, {useState} from "react";
import { Tabs, Table, Input, Space, Card } from "antd";

import "./Instructors.less"
import useInstructors from "../../api/useInstructors";
import { Instructor } from "../../api/useInstructors";
import {ScreeningStatus, Student, TeacherModule, ApiScreeningResult} from "../../types/Student";
import Title from "antd/lib/typography/Title";
import useDebounce from "../../utils/useDebounce";

const possibleScreeningStatus: { [key in ScreeningStatus]: string } = {
    UNSCREENED: "Prüfen",
    ACCEPTED: "Angenommen",
    REJECTED: "Abgelehnt"
}

const Instructors = () => {
    const  [screeningStatus, setScreeningStatus] = useState<ScreeningStatus>(ScreeningStatus.Unscreened);
    const  [search, setSearch] = useState<string>("");
    const  [editInstructor, setEditInstructor] = useState<Instructor | null>(null);

    const { instructors, loadInstructors, loading, updateInstructor } = useInstructors({ initialStatus: ScreeningStatus.Unscreened, initialSearch: "" });

    console.log(instructors);
    
    useDebounce({ screeningStatus, search }, 1000, loadInstructors);

    return (
        <div className="course-container">
            {editInstructor && <UpdateInstructor
            instructor={editInstructor}
            updateInstructor={updateInstructor}
            close={() => setEditInstructor(null)}
            />}
            {!editInstructor && <InstructorTable
                screeningStatus={screeningStatus}
                setScreeningStatus={setScreeningStatus}
                instructors={instructors}
                loading={loading}
                setSearch={setSearch}
                setEditInstructor={setEditInstructor}
            />}
        </div>
    )
}

function InstructorTable({ screeningStatus, setScreeningStatus, instructors, loading, setSearch, setEditInstructor }: { screeningStatus: ScreeningStatus, setScreeningStatus(screeningStatus: ScreeningStatus): void, instructors: Instructor[], loading: boolean, setSearch(search: string): void, setEditInstructor(instructor: Instructor): void}) {
    const columns = [
        {
            title: "Nachname",
            dataIndex: "lastname",
            key: "lastname",
        },
        {
            title: "Vorname",
            dataIndex: "firstname",
            key: "firstname,"
        },
        {
            title: "Kursleiter-Typ",
            dataIndex: "module",
            key: "module",
            render: (module: TeacherModule) => module ? "Praktikum" : "Sommer-AGs",
        }

    ];

    const onSearch = (event: { target: { value: string; }; }) => {
        setSearch(event.target.value);
    }

    const searchField = <Input
        size="large"
        style={{ width: "400px" }}
        placeholder="Nach einem Kursleiter suchen..."
        allowClear
        onChange={onSearch}
    />

    return (
        <div className="list">
            <div className="header">
                <Title style={{ color: "#6c757d", marginTop: 0 }} level={4}>
                    Kursleiter
                </Title>
            </div>
            <Tabs
                tabBarExtraContent={searchField}
                activeKey={ screeningStatus }
                onChange={k => setScreeningStatus(k as ScreeningStatus)}>
                {Object.keys(possibleScreeningStatus).map((screeningStatus) => {
                    return (
                        <Tabs.TabPane
                            tab={possibleScreeningStatus[screeningStatus as ScreeningStatus]}
                            key={screeningStatus}>
                            <Space size="small" direction="vertical" style={{ width: "100%" }}>
                                <Table
                                    loading={loading}
                                    dataSource={instructors}
                                    className="hover"
                                    columns={columns}
                                    onRow={record => ({ onClick() { setEditInstructor(record); }})}/>
                            </Space>
                        </Tabs.TabPane>

                    )
                })}

            </Tabs>

        </div>
    )

}


function UpdateInstructor({ instructor, updateInstructor, close }: { instructor: Instructor, updateInstructor(instructor: Instructor, update: ApiScreeningResult): Promise<void>, close(): void }) {
    const [phone, setPhone] = useState(instructor.phone);
    const [birthday, setbirthday] = useState(instructor.birthday);
    const [commentScreener, setcommentScreener] = useState("instructor.__screening__.comment");
    const [knowscsfrom, setknowscsfrom] = useState("instructor.__screening__.knowsCoronaSchoolFrom");
    const [screenerEmail, setscreenerEmail] = useState(instructor.email);
    const [subjects, setsubjects] = useState(instructor.subjects);
    const [feedback, setfeedback] = useState(instructor.feedback);

    const [isEditMode, setIsEditMode] = useState(false);

    function update(verified: ApiScreeningResult["verified"]){
        updateInstructor(instructor, {
            verified, phone, birthday, commentScreener, knowscsfrom, screenerEmail, subjects, feedback
        }).then(close);
    }

// copied from Courses.tsx
    // const InstructorDetails = () => {
    //     const categoryMenu = (
    //         <Menu>
    //             {Object.entries(categoryName)
    //                 .map(([category, name]) => 
    //                     <Menu.Item onClick={() => setCategory(category as CourseCategory)}>
    //                             {name}
    //                     </Menu.Item>    
    //             )}
        
        
    //         </Menu>
    //     );

    //     return (
    //         <div className="course-details">
    //             <Card title={ <><FileTextOutlined /> Beschreibung:</> }>
    //                 { !isEditMode && description }
    //                 { isEditMode && <TextArea value={ description }
    //                                           onChange={(e) => setDescription(e.target.value) }/>
    //                 }
    //             </Card>
    //             <br/>
    //             <Card title={ <><FileTextOutlined /> Gliederung:</> }>
    //                 { !isEditMode && outline }
    //                 { isEditMode && <TextArea value={ outline }
    //                                           onChange={(e) => setOutline(e.target.value)}/>
    //                 }
    //             </Card>
    //             <br/>
    //             <Card title={<><FileTextOutlined /> Kategorie: </>}>
    //                 {!isEditMode && categoryName[category]}
    //                 {isEditMode && <Dropdown.Button overlay={categoryMenu} icon={<DownOutlined />}>
    //                     <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
    //                         {categoryName[category]}
    //                     </a>
    //                 </Dropdown.Button>}
    //             </Card>
    //             <br/>
    //             <Card title={ <><FileTextOutlined /> Kommentar:</> }>
    //                 { !isEditMode && screeningComment }
    //                 { isEditMode && <TextArea value={ screeningComment || "" }
    //                                           onChange={(e) => setScreeningComment(e.target.value)}/>
    //                 }
    //             </Card>
    //         </div>
    //     );
    // };
    return (
        <div className="update-instructor">
            Hallo!
        </div>
    )
}

export default Instructors;