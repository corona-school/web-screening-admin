import React, { useState, useEffect } from "react";
import {Button, Card, Input, Space, Table, Tabs, Descriptions, Checkbox, Typography } from "antd";
import Markdown from "react-markdown";
import { useHistory } from "react-router-dom"

import "./Instructors.less"
import useInstructors, {Instructor} from "../../api/useInstructors";
import {
    ApiScreeningResult,
    ScreeningStatus,
    TeacherModule,
    StateLong,
    State,
    TeacherModulePretty
} from "../../types/Student";
import useDebounce from "../../utils/useDebounce";
import {createSubjects, subjectToString} from "../../utils/subjectUtils";
import {ArrowLeftOutlined, EditOutlined, FileTextOutlined, MailOutlined, PhoneOutlined, TableOutlined, IdcardOutlined, ProfileOutlined } from "@ant-design/icons";
import { screeningTemplateAG, screeningTemplateIntern } from "./screeningTemplate";
import { ISubject } from "../../api";
import SubjectList from "../userList/SubjectList";
import { Pagination } from "../navigation/Pagination";

const { TextArea } = Input;
const { Title, Text } = Typography;

const possibleScreeningStatus: { [key in ScreeningStatus]: string } = {
    UNSCREENED: "Prüfen",
    ACCEPTED: "Angenommen",
    REJECTED: "Abgelehnt"
}

const Instructors = () => {
    const  [screeningStatus, setScreeningStatus] = useState<ScreeningStatus>(ScreeningStatus.Unscreened);
    const  [search, setSearch] = useState<string>("");
    const  [page, setPage] = useState(0);
    const  [editInstructor, setEditInstructor] = useState<Instructor | null>(null);

    const { instructors, loadInstructors, loading, updateInstructor } = useInstructors({ initialStatus: ScreeningStatus.Unscreened, initialSearch: "" });

    console.log(instructors);
    
    const debouncedSearch = useDebounce(search, 1000);
        
    useEffect(() => { loadInstructors({ screeningStatus, search: debouncedSearch, page }); }, [screeningStatus, debouncedSearch, page]);

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
                page={page}
                setPage={setPage}
            />}
        </div>
    )
}

function InstructorTable({ screeningStatus, setScreeningStatus, instructors, loading, setSearch, setEditInstructor, page, setPage }: { screeningStatus: ScreeningStatus, setScreeningStatus(screeningStatus: ScreeningStatus): void, instructors: Instructor[], loading: boolean, setSearch(search: string): void, setEditInstructor(instructor: Instructor): void, page: number, setPage(page: number): void }) {
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
        if(toScreeningStatus(record.__instructorScreening__?.success) === screeningStatus)
            return '';
            
        if(record.__instructorScreening__?.success === true)
            return 'green';
            
        if(record.__instructorScreening__?.success === false)
            return 'red';

        return "";
    };

    const onSearch = (event: { target: { value: string; }; }) => {
        setPage(0);
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
                                    pagination={false}
                                    loading={loading}
                                    dataSource={instructors}
                                    className="hover"
                                    columns={columns}
                                    rowClassName={rowClassName}
                                    onRow={record => ({ onClick() { setEditInstructor(record); }})}/>
                                <Pagination page={page} setPage={setPage} hasNextPage={instructors.length === 20} />
                            </Space>
                        </Tabs.TabPane>

                    )
                })}

            </Tabs>

        </div>
    )

}


function UpdateInstructor({ instructor, updateInstructor, close }: { instructor: Instructor, updateInstructor(instructor: Instructor, update: ApiScreeningResult): Promise<void>, close(): void }) {
    const screening = instructor.__instructorScreening__ ?? { comment: (instructor.module ? screeningTemplateIntern : screeningTemplateAG), knowsCoronaSchoolFrom: "", success: null };
    const history = useHistory();

    const [phone, setPhone] = useState(instructor.phone);
    const [commentScreener, setCommentScreener] = useState(screening.comment);
    
    // we might want to support these in future releases depending on management

    const [knowscsfrom, setKnowscsfrom] = useState(screening.knowsCoronaSchoolFrom);
    const [subjects, setSubjects] = useState(instructor.subjects);
    const [feedback, setFeedback] = useState(instructor.feedback);

    const [isStudent, setIsStudent] = useState(instructor.isStudent);

    const [isEditMode, setIsEditMode] = useState(false);

    const isEdited = commentScreener !== screening.comment;

    function update(verified: boolean){
        updateInstructor(instructor, {
            verified, phone, commentScreener, isStudent, knowscsfrom, subjects, feedback
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

                {!isEditMode &&
                <Space size="small">
                    <Button
                        onClick={() => {
                            update(false);
                            history.push(`/student/${instructor.email}`);
                        }}
                    >
                        Nur für Eins-zu-Eins-Betreuung verifizieren
                    </Button>
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
                    { showSaveButton && <Button onClick={() => update(instructor.__instructorScreening__!.success)}>Speichern</Button> }
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
                { isEditMode && <TextArea 
                    value={ commentScreener }
                    onChange={ (e) => setCommentScreener(e.target.value) } 
                    style={{ minHeight: "500px" }}
                />}
            </Card>
        );

        const studentField = () => {
            const TEXT = "Für Eins-zu-Eins-Betreuung geeignet"

            return (
                <Card>
                    { (!isEditMode && isStudent) &&
                        <Text strong>{ TEXT }</Text>
                    }
                    { (!isEditMode && !isStudent) &&
                        <Text delete strong>{ TEXT }</Text>
                    }
                    {isEditMode &&
                        <Space>
                            <Checkbox onChange={() => setIsStudent(!isStudent)} checked={isStudent}/>
                            <Text strong>{ TEXT }</Text>
                        </Space>
                    }
                </Card>
            );
        };

        const instructorFeedback = () => {
            return (
                <Card title={ <> <FileTextOutlined /> Feedback vom Kursleiter </> }>
                    <Space direction="vertical" style={{width: "100%"}}>
                        <div>
                            <Text strong>Kennt Corona School durch:</Text>
                            <br/>
                            {!isEditMode && <Text>{ knowscsfrom }</Text>}
                            {isEditMode &&
                            <Input value={knowscsfrom}
                                   onChange={(event) => setKnowscsfrom(event.target.value)}
                                   defaultValue="Kennt Corona School durch..." /> }
                        </div>
                        <div>
                            <Text strong>Kommentar vom Kursleiter:</Text>
                            <br/>
                            {!isEditMode && <Text>{ feedback }</Text>}
                            {isEditMode &&
                            <TextArea value={feedback}
                                      onChange={(event) => setFeedback(event.target.value)}
                                      rows={4} />}
                        </div>
                    </Space>
                </Card>
            )
        }

        const subjectInformation = () => {
            return (
                <Card title={ <> <TableOutlined /> Fächer </> }>
                    {isEditMode &&
                        <SubjectList subjects={createSubjects(subjects)}
                                     setSubjects={(s) => setSubjects(subjectToString(s))} />}
                    {!isEditMode &&
                        <Descriptions bordered size="small" layout="horizontal" column={1}>
                            {createSubjects(subjects).map((s) =>
                                <Descriptions.Item label={s.subject}>
                                    {`Klasse ${s.min} bis ${s.max}`}
                                </Descriptions.Item>
                            )}
                        </Descriptions>}
                </Card>
            )
        }

        return (
            <div className="custom-details">
                <Space direction="vertical" style={{width: "100%"}}>
                    { studentField() }
                    { commentField }
                    { subjectInformation() }
                    { instructorFeedback() }
                </Space>
            </div>
        )
    }

    const studentDetails = () => {
        const instructorType = (
            <Descriptions.Item label={ <> <IdcardOutlined /> Kursleiter-Typ </> }>
                { instructor.module ? "Praktikum" : "Sommer-AG" }
            </Descriptions.Item>
        )

        const message = (
            <Descriptions.Item label={ <> <FileTextOutlined /> Nachricht </> }>
                { instructor.msg ?? "-" }
            </Descriptions.Item>
        )

        const emailField = (
            <Descriptions.Item label={<> <MailOutlined /> E-Mail </>}>
                <a href={ "mailto: " + instructor.email}>
                    { instructor.email }
                </a>
            </Descriptions.Item>
        )

        const phoneField = (
            <Descriptions.Item label={ <> <PhoneOutlined /> Telefonnummer </> }>
                {phone ?? "-"}
            </Descriptions.Item>
        )

        const teacherData = (
            <Descriptions.Item label={<> <ProfileOutlined /> Lehrerdaten</>}>
                <table>
                    <tbody>
                        <tr>
                            <td>Bundesland:</td>
                            <td>{ StateLong[instructor.state as State] }</td>
                        </tr>
                        <tr>
                            <td>Universität:</td>
                            <td>{ instructor.university }</td>
                        </tr>
                        <tr>
                            <td>Modultyp:</td>
                            <td>{ TeacherModulePretty[instructor.module as TeacherModule] }</td>
                        </tr>
                        <tr>
                            <td>Modulstunden:</td>
                            <td>{ instructor.moduleHours }</td>
                        </tr>
                    </tbody>
                </table>
            </Descriptions.Item>
        )

        return (
            <div className="student-details">
                <Descriptions layout="vertical" column={1} bordered={true}>
                    { instructorType }
                    { message }
                    { emailField }
                    { phoneField }
                    { (instructor.module != undefined) && teacherData}
                </Descriptions>
            </div>
        )
    }

    return (
        <div className="update-instructor">
            { Header() }
            { customDetails() }
            { studentDetails() }
        </div>
    );
 
}

export default Instructors;