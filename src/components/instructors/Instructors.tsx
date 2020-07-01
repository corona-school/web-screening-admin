import React, { useState, useEffect } from "react";
import {Button, Card, Input, Space, Table, Tabs} from "antd";
import Markdown from "react-markdown";

import "./Instructors.less"
import useInstructors, {Instructor} from "../../api/useInstructors";
import {ApiScreeningResult, ScreeningStatus, TeacherModule} from "../../types/Student";
import Title from "antd/lib/typography/Title";
import useDebounce from "../../utils/useDebounce";
import {ArrowLeftOutlined, EditOutlined, FileTextOutlined} from "@ant-design/icons";
import { screeningTemplateAG, screeningTemplateIntern } from "./screeningTemplate";

const { TextArea } = Input;

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
    
    const debouncedSearch = useDebounce(search, 1000);
        
    useEffect(() => { loadInstructors({ screeningStatus, search: debouncedSearch }); }, [screeningStatus, debouncedSearch]);

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

    const toScreeningStatus = (status: boolean | undefined) => status === undefined ? ScreeningStatus.Unscreened : (status ? ScreeningStatus.Accepted : ScreeningStatus.Rejected);


    const rowClassName = (record: Instructor) => {
        // in case this table shows what the screener expects, apply no color
        if(toScreeningStatus(record.__screening__?.success) === screeningStatus)
            return '';
            
        if(record.__screening__?.success === true)
            return 'green';
            
        if(record.__screening__?.success === false) 
            return 'red';

        return "";
    };

    const onSearch = (event: { target: { value: string; }; }) => {
        setSearch(event.target.value);
    }

    const searchField = <Input
        size="large"
        style={{ width: "400px" }}
        placeholder="Suche nach Nachname oder Email"
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
                                    rowClassName={rowClassName}
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
    const screening = instructor.__screening__ ?? { comment: (instructor.module ? screeningTemplateIntern : screeningTemplateAG), knowsCoronaSchoolFrom: "", success: null };

    const [phone, setPhone] = useState(instructor.phone);
    const [commentScreener, setCommentScreener] = useState(screening.comment);
    
    // we might want to support these in future releases depending on management

    /*const [knowscsfrom, setKnowscsfrom] = useState(screening.knowsCoronaSchoolFrom);
    const [subjects, setSubjects] = useState(instructor.subjects);
    const [feedback, setFeedback] = useState(instructor.feedback);*/

    const [isStudent, setIsStudent] = useState(instructor.isStudent);

    const [isEditMode, setIsEditMode] = useState(false);

    const isEdited = commentScreener !== screening.comment;

    function update(verified: boolean){
        updateInstructor(instructor, {
            verified, phone, commentScreener, isStudent /* knowscsfrom, subjects, feedback, */ 
        }).then(close);
    }

    const Header = () => {
        const showAcceptButton = !screening.success;
        const showRejectButton = screening.success !== false;
        const showSaveButton = screening.success !== null;

        return (
            <div className="header">
                <Space size="large" style={{ width: "100%"}}>
                    <Button onClick={() => (!isEdited || window.confirm("Willst du die Änderungen verwerfen?")) && close()}  icon={<ArrowLeftOutlined />}/>
                    <Title style={{ color: "#6c757d"}} level={4}>{ instructor.firstname + " " + instructor.lastname}</Title>
                </Space>

                {!isEditMode && <Space size="small">
                    { showAcceptButton &&
                        <Button onClick={() => update(true)} style={{ background: "#B5F1BB" }}>
                            Annehmen
                        </Button>
                    }
                    { showRejectButton &&
                        <Button onClick={() => update(false)} style={{ background: "#F5AFAF" }}>
                            Ablehnen
                        </Button>
                    }
                    <Button onClick={() => setIsEditMode(true)} icon={<EditOutlined />}/>
                </Space>}

                {isEditMode && <Space size="small">
                    { showSaveButton && <Button onClick={() => update(instructor.__screening__!.success)}>Speichern</Button> }
                    { showAcceptButton &&
                        <Button onClick={() => update(true)} style={{ background: "#B5F1BB" }}>
                            Speichern und Annehmen
                        </Button>
                    }
                    { showRejectButton &&
                        <Button onClick={() => update(false)} style={{ background: "#F5AFAF" }}>
                            Speichern und Ablehnen
                        </Button>
                    }
                </Space>}
            </div>
        );
    };

    const customDetails = () => {
        const commentField = (
            <Card title={ <><FileTextOutlined /> Kommentar: </> }>
                { !isEditMode && <Markdown source={commentScreener} />}
                { isEditMode && <TextArea value={ commentScreener }
                                          onChange={ (e) => setCommentScreener(e.target.value) } />}
            </Card>
        );

        const studentField = (
            <Card title={<><FileTextOutlined /> Betreuer: </>}>
                { !isEditMode && (isStudent ? "Hilft auch Schülern" : "Ist nur Referent")}
                { isEditMode && (isStudent ?  <Button key="no" onClick={() => setIsStudent(false)}>Ist nur Referent</Button> : <Button key="yes" onClick={() => setIsStudent(true)}>Hilft auch Schülern</Button>)}
            </Card>
        );

        const otherFields = (
            <Card title={<><FileTextOutlined /> Daten: </>}>
                Telefonnummer: {phone ?? "-"}<br/>
                Email: {instructor.email}
            </Card>
        )

        return (
            <div className="custom-details">
                { commentField }
                { studentField }
                { otherFields }
            </div>
        )
    }

    return (
        <div className="update-instructor">
            { Header() }
            { customDetails() }
        </div>
    );
 
}

export default Instructors;