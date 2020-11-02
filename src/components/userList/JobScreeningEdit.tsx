import React, { useEffect, useState } from 'react';
import {
  Descriptions,
  Tag,
  Select,
  Button,
  Modal,
  Checkbox,
  Radio,
  Tooltip,
} from 'antd';
import { IJobInfo } from '../../api';
import {
  StatusMap,
  getScreeningType,
  ScreeningColorMap,
  ScreeningTypeText,
} from './data';
import TextArea from 'antd/lib/input/TextArea';
import SubjectList from './SubjectList';
import { Link } from 'react-router-dom';
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';

import classes from './JobScreeningEdit.module.less';
import {
  IStudent,
  ScreeningInfo,
  State,
  StateLong,
  TeacherModule,
  TeacherModulePretty,
} from '../../types/Student';
import ProjectList from './ProjectList';
import { RadioChangeEvent } from 'antd/lib/radio';
import { getJufoParticipantStatus } from '../../utils/student';

const { Option } = Select;
const { confirm } = Modal;

interface Props {
  selectedJob: IJobInfo;
  setSelectedJob: (job: IJobInfo) => void;
  completeJob: (job: IJobInfo, screening: ScreeningInfo) => void;
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
  const [screeningTypes, setScreeningTypes] = useState<string[]>(
    getScreeningType(selectedJob)
  );

  const getInitialScreening = () => {
    if (screeningTypes.includes('tutor')) {
      return selectedJob.data.screenings.tutor;
    } else if (screeningTypes.includes('instructor')) {
      return selectedJob.data.screenings.instructor;
    } else if (screeningTypes.includes('projectCoach')) {
      return selectedJob.data.screenings.projectCoach;
    } else {
      return undefined;
    }
  };
  const initialScreening = getInitialScreening();

  const [knowsFrom, setKnowsFrom] = useState(
    initialScreening?.knowsCoronaSchoolFrom || ''
  );
  const [isConfirmed, setConfirmed] = useState(
    selectedJob.data.jufoPastParticipationConfirmed
  );
  const [draftKnowsFrom, setDraftKnowsFrom] = useState(knowsFrom);
  const [comment, setComment] = useState(initialScreening?.comment || '');

  const done = (
    job: IJobInfo,
    comment: string,
    knowsFrom: string,
    decision: boolean
  ) => {
    completeJob(job, {
      verified: decision,
      knowsCoronaSchoolFrom: knowsFrom,
      comment: comment,
    });
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
        'Der Job wird aus der Warteschlange entfernt und die/ der Student*in muss sich neu anmelden, um sich verifizieren zu lassen.',
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

  const handleInput = (key: string) => (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | RadioChangeEvent
  ) => {
    changeJob(key, e.target.value);
  };

  const handleProjectCoachCertificateValidation = (checked: boolean) => {
    if (selectedJob.data.hasJufoCertificate && checked) {
      changeJob('jufoPastParticipationConfirmed', true);
    }
    if (selectedJob.data.hasJufoCertificate && !checked) {
      changeJob('hasJufoCertificate', false);
    }
    if (!selectedJob.data.hasJufoCertificate && checked) {
      changeJob('hasJufoCertificate', true);
      changeJob('jufoPastParticipationConfirmed', true);
    }
    if (!selectedJob.data.hasJufoCertificate && !checked) {
      // do nothing wait for manual jufo check
    }
  };

  const getCertificateText = () => {
    if (selectedJob.data.hasJufoCertificate) {
      return (
        <>
          Hat die/der Student*in ein gültigen Nachweis über die Teilnahme bei
          JugendForscht?{' '}
          <Tooltip
            placement="bottom"
            title="Zum freischalten einer/eines Jufo-Teilnehmer*in wird kein güliger Nachweis benötigt. Dieser wird sonst manuell bei JugendForscht angefordert und nachträglich eingetragen."
          >
            <QuestionCircleOutlined style={{ cursor: 'pointer' }} />
          </Tooltip>
        </>
      );
    }

    return <>Hat der/die Student*in doch ein gültigen Nachweis?</>;
  };

  const getJufoStatus = (job: IStudent) => {
    if (job.jufoPastParticipationConfirmed == undefined) {
      return <Tag color="geekblue">Wird überprüft</Tag>;
    }
    if (job.jufoPastParticipationConfirmed === false) {
      return <Tag color="red">Abgelehnt</Tag>;
    }

    return <Tag color="green">Bestätigt</Tag>;
  };

  const room = new URL(selectedJob.data.jitsi).pathname;

  return (
    <div className={classes.container}>
      <Descriptions
        title="Studierenden-Information"
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
          {screeningTypes.map((type) => (
            <Tag
              color={ScreeningColorMap.get(type)}
              key={ScreeningColorMap.get(type)}
            >
              {ScreeningTypeText.get(type)}
            </Tag>
          ))}
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
      {screeningTypes.includes('projectCoach') && (
        <Descriptions
          title="Jugend Forscht Informationen"
          layout="horizontal"
          column={2}
        >
          <Descriptions.Item label="Jufo-Alumni">
            {getJufoParticipantStatus(selectedJob.data.wasJufoParticipant)}
          </Descriptions.Item>
          <Descriptions.Item label="Hat ein Jufo-Zertifikat">
            {selectedJob.data.hasJufoCertificate ? 'Ja' : 'Nein'}
          </Descriptions.Item>

          {!selectedJob.data.hasJufoCertificate && (
            <Descriptions.Item label="Status Jugend Forscht:">
              {getJufoStatus(selectedJob.data)}
            </Descriptions.Item>
          )}
        </Descriptions>
      )}
      {screeningTypes.includes('instructor') && (
        <Descriptions title="DLL-Spezifisch" layout="horizontal" column={2}>
          <Descriptions.Item label="Bundesland">
            {StateLong[selectedJob.data.state as State]}
          </Descriptions.Item>
          <Descriptions.Item label="Universität">
            {selectedJob.data.university}
          </Descriptions.Item>
          <Descriptions.Item label="Modul-Typ">
            {
              TeacherModulePretty[
                selectedJob.data.official?.module as TeacherModule
              ]
            }
          </Descriptions.Item>
          <Descriptions.Item label="Modulstunden">
            {selectedJob.data.official?.hours}
          </Descriptions.Item>
        </Descriptions>
      )}
      <div className="title">Screening Angaben</div>
      <div className="label">Feedback des Studierenden: </div>
      <TextArea
        rows={2}
        placeholder="Feedback des Studierenden"
        value={selectedJob.data.feedback}
        onChange={feedback}
      />
      <div className="label">Wie hat die/ der Student*in von uns erfahren?</div>
      <Select
        onChange={(v) => {
          setDraftKnowsFrom(v);
          if (v !== '13') {
            setKnowsFrom(v);
          } else {
            setKnowsFrom('');
          }
        }}
        defaultValue={knowsFrom}
        style={{ marginBottom: '16px', width: '100%' }}
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
      {draftKnowsFrom === '13' && (
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
      {screeningTypes.includes('tutor') && (
        <>
          <div className="label">Fächer: </div>
          <SubjectList
            subjects={selectedJob.data.subjects}
            setSubjects={(subjects) => changeJob('subjects', subjects)}
          />
        </>
      )}
      {screeningTypes.includes('projectCoach') && (
        <div>
          <div className="label">JuFo-Projekte: </div>
          <ProjectList
            projects={selectedJob.data.projectFields}
            setProjects={(projects) => changeJob('projectFields', projects)}
          />
          <Checkbox
            checked={selectedJob.data.isUniversityStudent}
            onChange={(event) => {
              changeJob('isUniversityStudent', event.target.checked);
            }}
            style={{ marginTop: '16px' }}
          >
            Eingeschriebene*r Student*in
          </Checkbox>

          {!isConfirmed && (
            // has certificate true
            <div>
              <div className="label">{getCertificateText()}</div>
              <Radio.Group
                style={{ marginTop: '8px' }}
                name="radiogroup"
                defaultValue={!!selectedJob.data.jufoPastParticipationConfirmed}
                onChange={(v) =>
                  handleProjectCoachCertificateValidation(v.target.checked)
                }
              >
                <Radio value={true}>Ja</Radio>
                <Radio value={false}>Nein</Radio>
              </Radio.Group>
            </div>
          )}

          <div>
            <div className="label">Informationen zu früherer Teilnahme</div>
            <TextArea
              placeholder="Der/Die Student*in hat an folgendem Projekt teilgenommen.."
              value={selectedJob.data.jufoPastParticipationInfo || ''}
              onChange={handleInput('jufoPastParticipationInfo')}
            />
          </div>
        </div>
      )}
      {(screeningTypes.includes('instructor') ||
        screeningTypes.includes('projectCoach')) && (
        <>
          <Checkbox
            checked={selectedJob.data.isTutor}
            onChange={(event) => {
              changeJob('isTutor', event.target.checked);
            }}
            style={{ marginTop: '16px' }}
          >
            Für 1:1-Lernunterstützung eintragen
          </Checkbox>
          <Tooltip
          placement="bottom"
          title="Hinweis: das erste Match wird nach Freischaltung automatisch zugeteilt, sofern es die freizuschaltende Person nicht in ihrem User-Bereich selbständig ändert."
          > 
            <QuestionCircleOutlined style={{ cursor: 'pointer' }} />
          </Tooltip>
        </>
      )}
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
