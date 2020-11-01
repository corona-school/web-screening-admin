import React, {useContext, useState} from 'react';
import {RouteComponentProps, withRouter} from 'react-router-dom';
import classes from './StudentInfo.module.less';
import useStudent from '../../api/useStudent';
import {Button, Spin, Typography, Modal, Space} from 'antd';
import {ApiContext} from '../../api/ApiContext';
import {
    IStudentInfo,
    ScreeningInfo
} from '../../types/Student';
import {
    BasicEditableInformationEditor,
    InstructorInformationEditor,
    JuFoInformationEditor,
    TutorInformationEditor,
    TypeEditor
} from "./InfoEditor";
import {DeleteOutlined, EditOutlined, SaveOutlined} from "@ant-design/icons";
import {
    BasicEditableInformationDisplay, BasicStaticInformation,
    InstructorInformationDisplay, JuFoInformationDisplay,
    TutorInformationDisplay,
    TypeDisplay
} from "./InfoDisplay";

const { Title } = Typography;
const { confirm } = Modal;

interface MatchParams {
  email: string | undefined;
}

const StudentInfo = (props: RouteComponentProps<MatchParams>) => {
    const [openEdit, setOpenEdit] = useState<boolean>(false);
    const email = props.match.params.email;

  if (!email) {
    props.history.push('/');
  }

  const { studentInfo, setStudentInfo, loading, save, reload } = useStudent(email || '');

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
      console.log(newStudentInfo);
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

    const SaveChanges = () => {
        if (!studentInfo) {
            return;
        }
        save(studentInfo);
        setOpenEdit(false);
    }

    const Abort = () => {
        confirm({
            title: "Möchtest du die Änderungen wirklich verwerfen?",
            okText: 'Ja',
            cancelText: 'Nein',
            onOk() {
                reload();
                setOpenEdit(false);
            },
            onCancel() {},
        });
    }

    return (
        <div className={classes.box}>
            <div className={classes.header}>
                <Title style={{color: '#6c757d', marginTop: 0}} level={4}>
                    Persönliche Informationen
                </Title>
                {!openEdit &&
                <Button
                    onClick={() => setOpenEdit(true)}
                    icon={<EditOutlined/>}
                    className={classes.button}
                />}
                {openEdit &&
                <Space size="small">
                    <Button
                        onClick={SaveChanges}
                        icon={<SaveOutlined/>}
                        className={classes.button}
                    />
                    <Button
                        onClick={Abort}
                        icon={<DeleteOutlined/>}
                        className={classes.button}
                    />
                </Space>
                }
            </div>

            <>
                <BasicStaticInformation studentInfo={studentInfo}/>
                {openEdit &&
                <>
                    <BasicEditableInformationEditor studentInfo={studentInfo} changeStudentInfo={changeStudentInfo}/>
                    <TypeEditor studentInfo={studentInfo} changeStudentInfo={changeStudentInfo} />
                    {studentInfo?.isTutor &&
                    <TutorInformationEditor
                        studentInfo={studentInfo}
                        changeStudentInfo={changeStudentInfo}
                        setScreening={setTutorScreening}/>}
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
                    <BasicEditableInformationDisplay studentInfo={studentInfo}/>
                    <TypeDisplay studentInfo={studentInfo}/>
                    {studentInfo?.isTutor && <TutorInformationDisplay studentInfo={studentInfo}/>}
                    {studentInfo?.isInstructor && <InstructorInformationDisplay studentInfo={studentInfo}/>}
                    {!openEdit && <JuFoInformationDisplay studentInfo={studentInfo}/>}
                </>
                }


            </>
        </div>
  );
};

export default withRouter(StudentInfo);
