import React, {useState} from "react";
import { Tabs, Table, Input, Space, Card, Button } from "antd";

import "./Instructors.less"
import useInstructors from "../../api/useInstructors";
import { Instructor } from "../../api/useInstructors";
import {ScreeningStatus, Student, TeacherModule, ApiScreeningResult} from "../../types/Student";
import Title from "antd/lib/typography/Title";
import useDebounce from "../../utils/useDebounce";
import { ArrowLeftOutlined, EditOutlined } from "@ant-design/icons";

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
        <div className="instructor-container">
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
    const [commentScreener, setcommentScreener] = useState(instructor.__screening__.comment || undefined);
    const [knowscsfrom, setknowscsfrom] = useState(instructor.__screening__.knowsCoronaSchoolFrom);
    const [screenerEmail, setscreenerEmail] = useState(instructor.email);
    const [subjects, setsubjects] = useState(instructor.subjects);
    const [feedback, setfeedback] = useState(instructor.feedback);
    const [isEditMode, setIsEditMode] = useState(false);

    const isEdited = 
        commentScreener !== instructor.__screening__.comment; 

    function update(verified: boolean){
        updateInstructor(instructor, {
            verified, phone, birthday, commentScreener, knowscsfrom, screenerEmail, subjects, feedback
        }).then(close);
    }

    const Header = () => {
        return (
            <div className="header">
                <Space size="large" style={{ width: "100%"}}>
                    <Button onClick={() => (!isEdited || window.confirm("Willst du die Änderungen verwerfen?")) && close()}  icon={<ArrowLeftOutlined />}/>
                    <Title style={{ color: "#6c757d"}} level={4}>{ instructor.firstname+ " " + instructor.lastname}</Title>
                </Space>

                {!isEditMode && <Space size="small">
                    {/*<Button onClick={ () => setCommentFormActive(true) }
                            style={{ background: "#C4C4C4", color: "#FFFFFF"}}>
                        Kommentieren
                    </Button>*/}
                    {instructor.verified !== true && <Button onClick={() => update(true)} style={{ background: "#B5F1BB" }}>
                        Annehmen
                    </Button>}
                    {instructor.verified !== false && <Button onClick={() => update(false)} style={{ background: "#F5AFAF" }}>
                        Ablehnen
                    </Button>}
                    <Button onClick={() => setIsEditMode(true)} icon={<EditOutlined />}/>
                </Space>}

                {isEditMode && <Space size="small">
                    <Button 
                    // onClick={ () => update(undefined)}
                            style={{ background: "#C4C4C4", color: "#FFFFFF"}}>
                        Speichern
                    </Button>
                    {instructor.verified !== true && <Button onClick={() => update(true)} style={{ background: "#B5F1BB" }}>
                        Speichern und Annehmen
                    </Button>}
                    {instructor.verified !== false && <Button onClick={() => update(false)} style={{ background: "#F5AFAF" }}>
                        Speichern und Ablehnen
                    </Button>}
                </Space>}
            </div>
        );
    };

    return (
        <div className="update-instructor">
            { Header() }
        </div>
    );
 
}

export default Instructors;