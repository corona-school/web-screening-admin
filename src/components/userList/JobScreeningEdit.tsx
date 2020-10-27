import React, {useEffect, useState} from 'react';
import { Descriptions, Tag, Select, Button, Modal, Checkbox } from 'antd';
import { IJobInfo } from '../../api';
import {StatusMap, knowsFromMap, getScreeningType, ScreeningColorMap, ScreeningTypeText} from './data';
import TextArea from 'antd/lib/input/TextArea';
import SubjectList from './SubjectList';
import { Link } from 'react-router-dom';
import { DeleteOutlined } from '@ant-design/icons';

import classes from './JobScreeningEdit.module.less';
import {State, StateLong, TeacherModule, TeacherModulePretty} from "../../types/Student";
import ProjectList from "./ProjectList";

const { Option } = Select;
const { confirm } = Modal;

interface Props {
  selectedJob: IJobInfo;
  setSelectedJob: (job: IJobInfo) => void;
  completeJob: (job: IJobInfo, decision: boolean) => void;
  removeJob: (email: string) => void;
  showButtons?: boolean;
}

const JobScreeningEdit = ({
  selectedJob,
  setSelectedJob,
  completeJob,
  removeJob,
  showButtons,
}: Props) => {
  const [screeningTypes, setScreeningTypes] = useState<string[]>(getScreeningType(selectedJob));
  const [knowsFrom, setKnowsFrom] = useState('13');
  const [comment, setComment] = useState('');

  const done = (
    job: IJobInfo,
    comment: string,
    knowsFrom: string,
    decision: boolean
  ) => {

    const completedJob: IJobInfo = {
      ...job,
      data: {
        ...job.data,
        screenings: {
          tutor: screeningTypes.includes('tutor') ? {
            comment,
            knowsCoronaSchoolFrom: knowsFrom,
            verified: decision,
          } : job.data.screenings.tutor,
          instructor: screeningTypes.includes('instructor') ? {
            comment,
            knowsCoronaSchoolFrom: knowsFrom,
            verified: decision,
          } : job.data.screenings.instructor,
          projectCoach: screeningTypes.includes('projectCoach') ? {
            comment,
            knowsCoronaSchoolFrom: knowsFrom,
            verified: decision,
          } : job.data.screenings.projectCoach,
        },
      },
    };
    completeJob(completedJob, decision);
  };

  useEffect(() => {
    setScreeningTypes(getScreeningType(selectedJob));
  }, [selectedJob]);

  const changeJob = (key: string, value: any) => {
    setSelectedJob({
      ...selectedJob,
      data: { ...selectedJob.data, [key]: value },
    });
  };

  const showDeleteConfirm = (email: string) => {
    confirm({
      title: 'Willst du diesen Job wirklich löschen?',
      content:
        'Der Job wird von der Warteschalgen entfernt und der Student muss sich neu anmelden, um sich verifizieren zu lassen.',
      okText: 'Ja',
      cancelText: 'Nein',
      onOk() {
        removeJob(email);
      },
      onCancel() {},
    });
  };

  const feedback = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    changeJob('feedback', e.target.value);
  };

  const room = new URL(selectedJob.data.jitsi).pathname;

  return (
    <div className={classes.container}>
      <Descriptions
        title="Studenten-Information"
        layout="horizontal"
        column={2}
      >
        <Descriptions.Item label="Name">
          {selectedJob.data.firstName} {selectedJob.data.lastName}
        </Descriptions.Item>
        <Descriptions.Item label="E-Mail">
          {selectedJob.data.email}
        </Descriptions.Item>
        <Descriptions.Item label="Art des Screenings">
          { screeningTypes.map(type =>
              <Tag color={ScreeningColorMap.get(type)}>
                {ScreeningTypeText.get(type)}
              </Tag>)
          }
        </Descriptions.Item>
        <Descriptions.Item label="Nachricht">
          {selectedJob.data.msg ? selectedJob.data.msg : '-'}
        </Descriptions.Item>

        <Descriptions.Item label="Status">
          <Tag color={StatusMap.get(selectedJob.status)}>
            {selectedJob.status.toUpperCase()}
          </Tag>
        </Descriptions.Item>
        {selectedJob.status !== 'waiting' && (
          <Descriptions.Item label="Screening-Link">
            <Link to={`screening/${selectedJob.data.email}${room}`}>
              Zum Screening
            </Link>
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Externer Video-Link">
          <a
            href={selectedJob.data.jitsi}
            target="_blank"
            rel="noopener noreferrer"
          >
            Video-Link
          </a>
        </Descriptions.Item>
      </Descriptions>

      {
        screeningTypes.includes('instructor') &&
        <Descriptions
          title="DLL-Spezifisch"
          layout="horizontal"
          column={2}>
          <Descriptions.Item label="Bundesland">
            {StateLong[selectedJob.data.state as State]}
          </Descriptions.Item>
          <Descriptions.Item label="Universität">
            {selectedJob.data.university}
          </Descriptions.Item>
          <Descriptions.Item label="Modul-Typ">
            {TeacherModulePretty[selectedJob.data.official?.module as TeacherModule]}
          </Descriptions.Item>
          <Descriptions.Item label="Modulstunden">
            {selectedJob.data.official?.hours}
          </Descriptions.Item>
        </Descriptions>
      }
      <div className="title">Screening Angaben</div>
      <div className="label">Feedback des Studenten: </div>
      <TextArea
        rows={2}
        placeholder="Feedback des Studenten"
        value={selectedJob.data.feedback}
        onChange={feedback}
      />
      <div className="label">Wie hat der Student von uns erfahren?</div>
      <Select
        onChange={setKnowsFrom}
        defaultValue={knowsFrom}
        style={{ marginBottom: '16px', marginTop: '16px', width: '100%' }}
      >
        <Option value="Bekannte"> Über Bekannte/Familie</Option>
        <Option value="Empfehlung"> Über eine Empfehlung</Option>
        <Option value="Schule"> Über Lehrer/Schule</Option>
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
          value={knowsFrom}
          onChange={(e) => setKnowsFrom(e.target.value)}
        />
      )}
      <div className="label">Kommentar: </div>
      <TextArea
        style={{ marginBottom: '16px' }}
        rows={2}
        value={comment}
        placeholder="Hier ein Kommentar (Optional)"
        onChange={(e) => setComment(e.target.value)}
      />
      { screeningTypes.includes('tutor') &&
      <>
        <div className="label">Fächer: </div>
        <SubjectList
            subjects={selectedJob.data.subjects}
            setSubjects={(subjects) => changeJob('subjects', subjects)}
        />
        </>
      }
      {
        screeningTypes.includes("projectCoach") &&
          <div>
            <div className="label">JuFo-Projekte: </div>
              <ProjectList
                  projects={selectedJob.data.projectFields}
                  setProjects={(projects) => changeJob('projectFields', projects)}
              />
              <Checkbox
                  checked={selectedJob.data.isUniversityStudent}
                  onChange={(event) => {
                    changeJob("isUniversityStudent", event.target.checked);
                  }}
                  style={{ marginTop: "8px" }}
              >
                Eingeschriebener Student
              </Checkbox>
          </div>
      }
      {
        (screeningTypes.includes("instructor") || screeningTypes.includes("projectCoach")) &&
          <Checkbox
            checked={selectedJob.data.isTutor}
            onChange={(event) => {
              changeJob("isTutor", event.target.checked);
            }}
            style={{ marginTop: "8px" }}>
            Für 1-zu-1-Betreuung geeignet
          </Checkbox>
      }
      {showButtons && (
        <div style={{ marginTop: '32px' }}>
          <Button
            style={{ margin: '4px 4px 4px 0px' }}
            danger
            key="back"
            onClick={() => done(selectedJob, comment, knowsFrom, false)}
          >
            Ablehen
          </Button>
          <Button
            style={{ margin: '4px' }}
            key="submit"
            type="primary"
            onClick={() => done(selectedJob, comment, knowsFrom, true)}
          >
            Freischalten
          </Button>
          <Button
            style={{ margin: '4px' }}
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(selectedJob.data.email)}
          ></Button>
        </div>
      )}
    </div>
  );
};

export default JobScreeningEdit;
