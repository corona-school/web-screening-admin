import {
    IStudentInfo,
    ScreeningInfo,
    State,
    StateLong,
    TeacherModule,
    TeacherModulePretty,
    TutorJufoParticipationIndication
} from "../../types/Student";
import {Checkbox, Descriptions, Input, Select, InputNumber, Button } from "antd";
import classes from "./StudentInfo.module.less";
import React, {useState} from "react";
import {knowsFromMap} from "../userList/data";
import SubjectList from "../userList/SubjectList";
import ProjectList from "../userList/ProjectList";

const {TextArea} = Input;
const {Option} = Select;

interface StudentInfoProps {
    studentInfo: IStudentInfo | null,
    changeStudentInfo: (key: string, value: any) => void,
}

interface StudentScreeningProps extends StudentInfoProps {
    setScreening: (screening: ScreeningInfo | undefined) => void
}

const ScreeningEditor = (
    {screening, setScreening}: { screening: ScreeningInfo | undefined, setScreening: (screening: ScreeningInfo | undefined) => void }
) => {
    const [knowsFrom, setKnowsFrom] = useState(
        knowsFromMap.has(screening?.knowsCoronaSchoolFrom || "")
            ? screening?.knowsCoronaSchoolFrom
            : "13"
    );

    const changeScreening = (key: string, value: any) => {
        if (!screening) {
            return;
        }
        const newScreening: ScreeningInfo = {
            ...screening,
            [key]: value
        };
        setScreening(newScreening);
    }

    return (
        <>
            {screening &&
            <>
                <Descriptions bordered size="small" column={1}>
                    <Descriptions.Item label="Verifiziert">
                        <Checkbox
                            checked={screening.verified}
                            onChange={event => changeScreening("verified", event.target.checked)}/>
                    </Descriptions.Item>
                    <Descriptions.Item label="Kommentar">
                        <TextArea
                            value={screening.comment || ""}
                            onChange={event => changeScreening("comment", event.target.value)}/>
                    </Descriptions.Item>
                    <Descriptions.Item label="Kennt uns durch">
                        <Select
                            onChange={(v) => {
                                setKnowsFrom(v);
                                if (v !== "13") {
                                    changeScreening("knowsCoronaSchoolFrom", v);
                                } else {
                                    changeScreening("knowsCoronaSchoolFrom", "");
                                }
                            }}
                            defaultValue={knowsFrom}
                            style={{marginBottom: '16px', marginTop: '16px', width: '100%'}}
                        >
                            <Option value="Bekannte"> Über Bekannte/Familie</Option>
                            <Option value="Empfehlung"> Über eine Empfehlung</Option>
                            <Option value="Schule"> Über Lehrer*in/Schule</Option>
                            <Option value="Universität"> Über die Universität</Option>
                            <Option value="Pressebericht"> Über einen Pressebericht</Option>
                            <Option value="Radiobeitrag"> Über einen Radiobeitrag</Option>
                            <Option value="Fernsehbeitrag"> Über einen Fernsehbeitrag</Option>
                            <Option value="Facebook"> Über Facebook</Option>
                            <Option value="Instagram"> Über Instagram</Option>
                            <Option value="TikTok"> Über TikTok</Option>
                            <Option value="Suchmaschine"> Über eine Suchmaschinen-Suche</Option>
                            <Option value="Werbeanzeige"> Über eine Werbeanzeige</Option>
                            <Option value="13"> anders</Option>
                        </Select>
                        {knowsFrom === '13' && (
                            <TextArea
                                rows={1}
                                placeholder="anderes"
                                value={screening.knowsCoronaSchoolFrom}
                                onChange={(event) =>
                                    changeScreening("knowsCoronaSchoolFrom", event.target.value)}
                            />
                        )}
                    </Descriptions.Item>
                </Descriptions>
                <Button onClick={() => setScreening(undefined)}>
                    Screening entfernen
                </Button>
            </>}
            {!screening &&
            <Button onClick={() => setScreening({verified: false})}>
                Screening hinzufügen
            </Button>}
        </>
    )
}

export const BasicEditableInformationEditor = ({studentInfo, changeStudentInfo}: StudentInfoProps) => {
    return (
        <Descriptions column={1} bordered className={classes.descriptionsStyle}>
            <Descriptions.Item label="Telefonnummer">
                <Input
                    value={studentInfo?.phone}
                    onChange={e => changeStudentInfo("phone", e.target.value)}/>
            </Descriptions.Item>
            <Descriptions.Item label="Nachricht">
                <TextArea
                    value={studentInfo?.msg}
                    onChange={e => changeStudentInfo("msg", e.target.value)}/>
            </Descriptions.Item>
            <Descriptions.Item label="Feedback">
                <TextArea
                    value={studentInfo?.feedback}
                    onChange={e => changeStudentInfo("feedback", e.target.value)}/>
            </Descriptions.Item>
            <Descriptions.Item label="Newsletter">
                <Checkbox
                    checked={studentInfo?.newsletter}
                    onChange={e => changeStudentInfo("newsletter", e.target.checked)}/>
            </Descriptions.Item>
        </Descriptions>
    );
}

export const TypeEditor = ({studentInfo, changeStudentInfo}: StudentInfoProps) => {
    return (
        <Descriptions column={1} bordered className={classes.descriptionsStyle}>
            <Descriptions.Item label="Tutor*in">
                <Checkbox
                    checked={studentInfo?.isTutor}
                    onChange={event => changeStudentInfo("isTutor", event.target.checked)}/>
            </Descriptions.Item>
            <Descriptions.Item label="Kursleiter*in">
                <Checkbox
                    checked={studentInfo?.isInstructor}
                    onChange={event => changeStudentInfo("isInstructor", event.target.checked)}/>
            </Descriptions.Item>
            <Descriptions.Item label="JuFo">
                <Checkbox
                    checked={studentInfo?.isProjectCoach}
                    onChange={event => changeStudentInfo("isProjectCoach", event.target.checked)}/>
            </Descriptions.Item>
        </Descriptions>
    )
}

export const TutorInformationEditor = ({studentInfo, changeStudentInfo, setScreening}: StudentScreeningProps) => {
    return (
        <Descriptions column={1} bordered title="Tutoren-Information" className={classes.descriptionsStyle}>
            <Descriptions.Item label="Fächer">
                <SubjectList
                    subjects={studentInfo?.subjects || []}
                    setSubjects={(subjects) => changeStudentInfo("subjects", subjects)}/>
            </Descriptions.Item>
            <Descriptions.Item label="Screening">
                <ScreeningEditor screening={studentInfo?.screenings.tutor}
                                 setScreening={setScreening}/>
            </Descriptions.Item>
        </Descriptions>
    )
}

export const InstructorInformationEditor = ({studentInfo, changeStudentInfo, setScreening}: StudentScreeningProps) => {
    return (
        <Descriptions column={1} bordered title="Kursleiter-Information" className={classes.descriptionsStyle}>
            <Descriptions.Item label="Bundesland">
                <Select
                    value={studentInfo?.state as State}
                    onChange={value => changeStudentInfo("state", value)}
                    style={{ width: "300px"}}
                    options={Object.entries(StateLong).map(e => ({ label: e[1], value: e[0]}))}/>
            </Descriptions.Item>
            <Descriptions.Item label="Universität">
                <Input
                    value={studentInfo?.university}
                    onChange={event => changeStudentInfo("university", event.target.value)} />
            </Descriptions.Item>
            <Descriptions.Item label="Modul-Typ">
                <Select
                    value={studentInfo?.official?.module as TeacherModule}
                    onChange={value => changeStudentInfo("official", {...studentInfo?.official, module: value})}
                    options={Object.entries(TeacherModulePretty).map(e => ({ label: e[1], value: e[0]}))}
                    style={{width: "120px"}} />
            </Descriptions.Item>
            <Descriptions.Item label="Modulstunden">
                <InputNumber
                    value={studentInfo?.official?.hours}
                    onChange={value => changeStudentInfo("official", {...studentInfo?.official, hours: value})}
                    min={0} />
            </Descriptions.Item>
            <Descriptions.Item label="Screening">
                <ScreeningEditor screening={studentInfo?.screenings.instructor}
                                 setScreening={setScreening}/>
            </Descriptions.Item>
        </Descriptions>
    )
}

export const JuFoInformationEditor = ({studentInfo, changeStudentInfo, setScreening}: StudentScreeningProps) => {
    return (
        <Descriptions column={1} bordered title="JuFo-Informationen" className={classes.descriptionsStyle}>
            <Descriptions.Item label="Projekte">
                    <ProjectList
                        projects={studentInfo?.projectFields || []}
                        setProjects={projects => changeStudentInfo("projectFields", projects)} />
            </Descriptions.Item>
            <Descriptions.Item label="JuFo-Alumni">
                <Select
                    value={studentInfo?.wasJufoParticipant}
                    onChange={value => changeStudentInfo("wasJufoParticipant", value)}
                    style={{width: "120px"}}>
                    <Option value={TutorJufoParticipationIndication.IDK}>Weiß nicht</Option>
                    <Option value={TutorJufoParticipationIndication.YES}>Ja</Option>
                    <Option value={TutorJufoParticipationIndication.NO}>Nein</Option>
                </Select>
            </Descriptions.Item>
            <Descriptions.Item label="Nachweis für frühere JuFo-Teilnahme">
                <Checkbox
                    checked={studentInfo?.hasJufoCertificate || false}
                    onChange={event => changeStudentInfo("hasJufoCertificate", event.target.checked)} />
            </Descriptions.Item>
            <Descriptions.Item label="Frühere Teilnahme bestätigt">
                <Checkbox
                    checked={studentInfo?.jufoPastParticipationConfirmed || false}
                    onChange={event => changeStudentInfo("jufoPastParticipationConfirmed", event.target.checked)} />
            </Descriptions.Item>
            <Descriptions.Item label="Informationen zu früherer Teilnahme">
                <TextArea
                    value={studentInfo?.jufoPastParticipationInfo}
                    onChange={event => changeStudentInfo("jufoPastParticipationInfo", event.target.value)} />
            </Descriptions.Item>
            <Descriptions.Item label="Eingeschriebene*r Student*in">
                <Checkbox
                    checked={studentInfo?.isUniversityStudent || false}
                    onChange={event => changeStudentInfo("isUniversityStudent", event.target.checked)} />
            </Descriptions.Item>
            <Descriptions.Item label="Screening">
                <ScreeningEditor
                    screening={studentInfo?.screenings.projectCoach}
                    setScreening={setScreening} />
            </Descriptions.Item>
        </Descriptions>
    )
}