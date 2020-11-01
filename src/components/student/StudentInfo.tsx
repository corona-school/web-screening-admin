import React, {useContext, useState} from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import classes from './StudentInfo.module.less';
import useStudent from '../../api/useStudent';
import {Checkbox, Descriptions, Input, Select, Spin, Tag, Typography,} from 'antd';
import {ApiContext} from '../../api/ApiContext';
import {
    IStudentInfo,
    ScreeningInfo,
    State,
    StateLong,
    TeacherModule,
    TeacherModulePretty,
    TutorJufoParticipationIndication
} from '../../types/Student';
import {knowsFromMap, ScreeningColorMap, ScreeningTypeText} from "../userList/data";
import SubjectList from "../userList/SubjectList";
import {
    BasicEditableInfoDisplay,
    InstructorInformationEditor,
    JuFoInformationEditor,
    TutorInformationEditor,
    TypeEditor
} from "./InfoEditor";

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface MatchParams {
  email: string | undefined;
}

const StudentInfo = (props: RouteComponentProps<MatchParams>) => {
  const context = useContext(ApiContext);
  const [openEdit, setOpenEdit] = useState<boolean>(true);
  const email = props.match.params.email;

  if (!email) {
    props.history.push('/');
  }

  const { studentInfo, setStudentInfo, loading, save } = useStudent(email || '');

    if (loading) {
        return (
            <div style={{textAlign: "center", margin: "20px 0"}}>
                <Spin size="large"/>
            </div>
        )
    }

  const changeStudentInfo = (key: string, value: any) => {
      if (!studentInfo) {
          return;
      }
      const newStudentInfo: IStudentInfo = {
          ...studentInfo,
          [key]: value,
      };
      setStudentInfo(newStudentInfo);
  };

  const setTutorScreening = (screening: ScreeningInfo) => {
      if (!studentInfo) {
          return;
      }
      const newStudentInfo: IStudentInfo = {
          ...studentInfo,
          screenings: {
              ...studentInfo.screenings,
              tutor: screening
          }
      }
      setStudentInfo(newStudentInfo);
  }

    const setInstructorScreening = (screening: ScreeningInfo) => {
        if (!studentInfo) {
            return;
        }
        const newStudentInfo: IStudentInfo = {
            ...studentInfo,
            screenings: {
                ...studentInfo.screenings,
                instructor: screening
            }
        }
        setStudentInfo(newStudentInfo);
    }

    const setProjectCoachScreening = (screening: ScreeningInfo) => {
        if (!studentInfo) {
            return;
        }
        const newStudentInfo: IStudentInfo = {
            ...studentInfo,
            screenings: {
                ...studentInfo.screenings,
                projectCoach: screening
            }
        }
        setStudentInfo(newStudentInfo);
    }

  const BooleanTag = ({value}: {value: boolean}) => {
      if (value) {
          return <Tag color="green">Ja</Tag>;
      } else {
          return <Tag color="red">Nein</Tag>;
      }
  }

  const TutorJufoParticipationIndicationTag = ({value}: {value: TutorJufoParticipationIndication}) => {
      switch (value) {
          case TutorJufoParticipationIndication.IDK:
              return <Tag color="default">Weiß nicht</Tag>;
          case TutorJufoParticipationIndication.YES:
              return <Tag color="green">Ja</Tag>;
          case TutorJufoParticipationIndication.NO:
              return <Tag color="red">Nein</Tag>;
      };
  };

    const BasicStaticInformation = () => {
        return (
            <Descriptions column={1} bordered className={classes.descriptionsStyle}>
                <Descriptions.Item label="Name">
                    {`${studentInfo?.firstName} ${studentInfo?.lastName}`}
                </Descriptions.Item>
                <Descriptions.Item label="E-Mail">
                    <a href={'mailto: ' + studentInfo?.email}>{studentInfo?.email}</a>
                </Descriptions.Item>
            </Descriptions>
        );
    }

    const BasicEditableInfoEdit = () => {
        return (
            <Descriptions column={1} bordered className={classes.descriptionsStyle}>
                <Descriptions.Item label="Telefonnummer">{studentInfo?.phone || "-"}</Descriptions.Item>
                <Descriptions.Item label="Nachricht">{studentInfo?.msg || "-"}</Descriptions.Item>
                <Descriptions.Item label="Feedback">{studentInfo?.feedback || "-"}</Descriptions.Item>
                <Descriptions.Item label="Newsletter">
                    <BooleanTag value={studentInfo?.newsletter || false} />
                </Descriptions.Item>
            </Descriptions>
        );
    }

    const TypeDisplay = () => {
        return (
            <Descriptions bordered column={1} className={classes.descriptionsStyle}>
                <Descriptions.Item label="Berechtigungen">
                    { studentInfo?.isTutor &&
                        <Tag color={ScreeningColorMap.get("tutor")}>
                            { ScreeningTypeText.get("tutor") }
                        </Tag> }
                    { studentInfo?.isInstructor &&
                        <Tag color={ScreeningColorMap.get("instructor")}>
                            { ScreeningTypeText.get("instructor") }
                        </Tag> }
                    { studentInfo?.isProjectCoach &&
                        <Tag color={ScreeningColorMap.get("projectCoach")}>
                            { ScreeningTypeText.get("projectCoach")}
                        </Tag> }
                </Descriptions.Item>
            </Descriptions>
        );
    }

    const ScreeningDisplay = ({screening}: {screening: ScreeningInfo}) => {
        return (
            <Descriptions bordered size="small" column={1}>
                <Descriptions.Item label="Verifiziert">
                    <BooleanTag value={screening.verified}/>
                </Descriptions.Item>
                <Descriptions.Item label="Kommentar">
                    {screening.comment || "-"}
                </Descriptions.Item>
                <Descriptions.Item label="Kennt uns durch">
                    {screening.comment || "-"}
                </Descriptions.Item>
            </Descriptions>
        );
    }

    const TutorInformationDisplay = () => {
        return (
            <Descriptions column={1} bordered title="Tutoren-Information" className={classes.descriptionsStyle}>
                <Descriptions.Item label="Fächer">
                    <Descriptions bordered size="small" column={1}>
                        {studentInfo?.subjects.map((s) => (
                            <Descriptions.Item label={s.name}>
                                {`Klasse ${s.grade.min} bis ${s.grade.max}`}
                            </Descriptions.Item>
                        ))}
                    </Descriptions>
                </Descriptions.Item>
                <Descriptions.Item label="Screening">
                    <ScreeningDisplay screening={studentInfo?.screenings.tutor || { verified: false }} />
                </Descriptions.Item>
            </Descriptions>
        )
    }

    const InstructorInformationDisplay = () => {
      return (
          <Descriptions column={1} bordered title="Kursleiter-Information" className={classes.descriptionsStyle}>
              <Descriptions.Item label="Bundesland">
                  { StateLong[studentInfo?.state as State] || "-" }
              </Descriptions.Item>
              <Descriptions.Item label="Universität">{ studentInfo?.university || "-" }</Descriptions.Item>
              <Descriptions.Item label="Modul-Typ">
                  { TeacherModulePretty[studentInfo?.official?.module as TeacherModule] || "-" }
              </Descriptions.Item>
              <Descriptions.Item label="Modulstunden">{ studentInfo?.official?.hours || "-" }</Descriptions.Item>
              <Descriptions.Item label="Screening">
                  <ScreeningDisplay screening={studentInfo?.screenings.instructor || { verified: false }} />
              </Descriptions.Item>
          </Descriptions>
      )
    }

    const JuFoInformationDisplay = () => {
      return (
          <Descriptions column={1} bordered title="JuFo-Informationen" className={classes.descriptionsStyle}>
              <Descriptions.Item label="Projekte">
                  <Descriptions bordered size="small" column={1}>
                      {studentInfo?.projectFields.map((s) => (
                          <Descriptions.Item label={s.name}>
                              {`Klasse ${s.min || "-"} bis ${s.max || "-"}`}
                          </Descriptions.Item>
                      ))}
                  </Descriptions>
              </Descriptions.Item>
              <Descriptions.Item label="JuFo-Alumni">
                  <TutorJufoParticipationIndicationTag
                      value={studentInfo?.wasJufoParticipant || TutorJufoParticipationIndication.IDK} />
              </Descriptions.Item>
              <Descriptions.Item label="Nachweis für frühere JuFo-Teilnahme">
                  <BooleanTag value={studentInfo?.hasJufoCertificate || false} />
              </Descriptions.Item>
              <Descriptions.Item label="Frühere Teilnahme bestätigt">
                  <BooleanTag value={studentInfo?.jufoPastParticipationConfirmed || false} />
              </Descriptions.Item>
              <Descriptions.Item label="Informationen zu früherer Teilnahme">
                  { studentInfo?.jufoPastParticipationInfo || "-" }
              </Descriptions.Item>
              <Descriptions.Item label="Eingeschriebene*r Student*in">
                  <BooleanTag value={studentInfo?.isUniversityStudent || false} />
              </Descriptions.Item>
              <Descriptions.Item label="Screening">
                  <ScreeningDisplay screening={studentInfo?.screenings.projectCoach || { verified: false }} />
              </Descriptions.Item>
          </Descriptions>
      )
    }

    return (
        <div className={classes.box}>
            <div className={classes.header}>
                <Title style={{color: '#6c757d', marginTop: 0}} level={4}>
                    Persönliche Informationen
                </Title>
            </div>

            <>
                <BasicStaticInformation/>
                {openEdit &&
                <>
                    <BasicEditableInfoDisplay studentInfo={studentInfo} changeStudentInfo={changeStudentInfo}/>
                    <TypeEditor studentInfo={studentInfo} changeStudentInfo={changeStudentInfo} />
                    {studentInfo?.isTutor &&
                    <TutorInformationEditor
                        studentInfo={studentInfo}
                        changeStudentInfo={changeStudentInfo}
                        setTutorScreening={setTutorScreening}/>}
                    {studentInfo?.isInstructor &&
                    <InstructorInformationEditor
                        studentInfo={studentInfo}
                        changeStudentInfo={changeStudentInfo}
                        setScreening={setInstructorScreening} />}
                    {studentInfo?.isProjectCoach &&
                    <JuFoInformationEditor
                        studentInfo={studentInfo}
                        changeStudentInfo={changeStudentInfo}
                        setScreening={setProjectCoachScreening} />}
                </>
                }
                {!openEdit &&
                <>
                    <BasicEditableInfoEdit/>
                    <TypeDisplay/>
                    {studentInfo?.isTutor && <TutorInformationDisplay/>}
                    {studentInfo?.isInstructor && <InstructorInformationDisplay/>}
                    {!openEdit && <JuFoInformationDisplay/>}
                </>
                }


            </>
        </div>
  );
};

export default withRouter(StudentInfo);
