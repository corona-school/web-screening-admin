import { Descriptions, Tag } from 'antd';
import classes from './StudentInfo.module.less';
import {
  IStudentInfo,
  ScreeningInfo,
  State,
  StateLong,
  TeacherModule,
  TeacherModulePretty,
  TutorJufoParticipationIndication,
} from '../../types/Student';
import React from 'react';
import { ScreeningColorMap, ScreeningTypeText } from '../userList/data';

const BooleanTag = ({ value }: { value: boolean }) => {
  if (value) {
    return <Tag color="green">Ja</Tag>;
  } else {
    return <Tag color="red">Nein</Tag>;
  }
};

const TutorJufoParticipationIndicationTag = ({
  value,
}: {
  value: TutorJufoParticipationIndication;
}) => {
  switch (value) {
    case TutorJufoParticipationIndication.IDK:
      return <Tag color="default">Weiß nicht</Tag>;
    case TutorJufoParticipationIndication.YES:
      return <Tag color="green">Ja</Tag>;
    case TutorJufoParticipationIndication.NO:
      return <Tag color="red">Nein</Tag>;
  }
};

const ScreeningDisplay = ({
  screening,
}: {
  screening: ScreeningInfo | undefined;
}) => {
  return (
    <>
      {screening && (
        <Descriptions bordered size="small" column={1}>
          <Descriptions.Item label="Verifiziert">
            <BooleanTag value={screening.verified} />
          </Descriptions.Item>
          <Descriptions.Item label="Kommentar">
            {screening.comment || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Kennt uns durch">
            {screening.knowsCoronaSchoolFrom || '-'}
          </Descriptions.Item>
        </Descriptions>
      )}
      {!screening && 'Nicht gescreened.'}
    </>
  );
};

export const BasicStaticInformation = ({
  studentInfo,
}: {
  studentInfo: IStudentInfo | null;
}) => {
  return (
    <Descriptions column={1} bordered className={classes.descriptionsStyle}>
      <Descriptions.Item label="Name">
        {`${studentInfo?.firstName} ${studentInfo?.lastName}`}
      </Descriptions.Item>
    </Descriptions>
  );
};

export const BasicEditableInformationDisplay = ({
  studentInfo,
}: {
  studentInfo: IStudentInfo | null;
}) => {
  return (
    <Descriptions column={1} bordered className={classes.descriptionsStyle}>
      <Descriptions.Item label="E-Mail">
        <a href={'mailto: ' + studentInfo?.email}>{studentInfo?.email}</a>
      </Descriptions.Item>
      <Descriptions.Item label="Telefonnummer">
        {studentInfo?.phone || '-'}
      </Descriptions.Item>
      <Descriptions.Item label="Nachricht">
        {studentInfo?.msg || '-'}
      </Descriptions.Item>
      <Descriptions.Item label="Feedback">
        {studentInfo?.feedback || '-'}
      </Descriptions.Item>
      <Descriptions.Item label="Newsletter">
        <BooleanTag value={studentInfo?.newsletter || false} />
      </Descriptions.Item>
    </Descriptions>
  );
};

export const TypeDisplay = ({
  studentInfo,
}: {
  studentInfo: IStudentInfo | null;
}) => {
  return (
    <Descriptions bordered column={1} className={classes.descriptionsStyle}>
      <Descriptions.Item label="Berechtigungen">
        {studentInfo?.isTutor && (
          <Tag color={ScreeningColorMap.get('tutor')}>
            {ScreeningTypeText.get('tutor')}
          </Tag>
        )}
        {studentInfo?.isInstructor && !studentInfo.official && (
          <Tag color={ScreeningColorMap.get('instructor')}>
            {ScreeningTypeText.get('instructor')}
          </Tag>
        )}
        {studentInfo?.isInstructor && !!studentInfo.official && (
          <Tag color={ScreeningColorMap.get('intern')}>
            {ScreeningTypeText.get('intern')}
          </Tag>
        )}
        {studentInfo?.isProjectCoach && (
          <Tag color={ScreeningColorMap.get('projectCoach')}>
            {ScreeningTypeText.get('projectCoach')}
          </Tag>
        )}
      </Descriptions.Item>
    </Descriptions>
  );
};

export const TutorInformationDisplay = ({
  studentInfo,
}: {
  studentInfo: IStudentInfo | null;
}) => {
  return (
    <Descriptions
      column={1}
      bordered
      title="Tutor*in"
      className={classes.descriptionsStyle}
    >
      <Descriptions.Item label="Fächer">
        <Descriptions bordered size="small" column={1}>
          {studentInfo?.subjects.map((s) => (
            <Descriptions.Item label={s.name}>
              {`Klasse ${s.grade?.min || '-'} bis ${s.grade?.max || '-'}`}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </Descriptions.Item>
      <Descriptions.Item label="Screening">
        <ScreeningDisplay screening={studentInfo?.screenings.tutor} />
      </Descriptions.Item>
    </Descriptions>
  );
};

export const InstructorInformationDisplay = ({
  studentInfo,
}: {
  studentInfo: IStudentInfo | null;
}) => {
  return (
    <Descriptions
      column={1}
      bordered
      title="Kursleiter*in/ Praktikant*in"
      className={classes.descriptionsStyle}
    >
      {!!studentInfo?.official && (
        <>
          <Descriptions.Item label="Bundesland">
            {StateLong[studentInfo?.state as State] || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Universität">
            {studentInfo?.university || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Modul-Typ">
            {TeacherModulePretty[
              studentInfo?.official?.module as TeacherModule
            ] || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="Modulstunden">
            {studentInfo?.official?.hours || '-'}
          </Descriptions.Item>
        </>
      )}
      <Descriptions.Item label="Screening">
        <ScreeningDisplay screening={studentInfo?.screenings.instructor} />
      </Descriptions.Item>
    </Descriptions>
  );
};

export const JuFoInformationDisplay = ({
  studentInfo,
}: {
  studentInfo: IStudentInfo | null;
}) => {
  return (
    <Descriptions
      column={1}
      bordered
      title="JuFo"
      className={classes.descriptionsStyle}
    >
      <Descriptions.Item label="Projekte">
        <Descriptions bordered size="small" column={1}>
          {studentInfo?.projectFields.map((s) => (
            <Descriptions.Item label={s.name}>
              {`Klasse ${s.min || '-'} bis ${s.max || '-'}`}
            </Descriptions.Item>
          ))}
        </Descriptions>
      </Descriptions.Item>
      <Descriptions.Item label="JuFo-Alumni">
        <TutorJufoParticipationIndicationTag
          value={
            studentInfo?.wasJufoParticipant ||
            TutorJufoParticipationIndication.IDK
          }
        />
      </Descriptions.Item>
      <Descriptions.Item label="Nachweis für frühere JuFo-Teilnahme">
        <BooleanTag value={studentInfo?.hasJufoCertificate || false} />
      </Descriptions.Item>
      <Descriptions.Item label="Frühere Teilnahme bestätigt">
        <BooleanTag
          value={studentInfo?.jufoPastParticipationConfirmed || false}
        />
      </Descriptions.Item>
      <Descriptions.Item label="Informationen zu früherer Teilnahme">
        {studentInfo?.jufoPastParticipationInfo || '-'}
      </Descriptions.Item>
      <Descriptions.Item label="Eingeschriebene*r Student*in">
        <BooleanTag value={studentInfo?.isUniversityStudent || false} />
      </Descriptions.Item>
      <Descriptions.Item label="Screening">
        <ScreeningDisplay screening={studentInfo?.screenings.projectCoach} />
      </Descriptions.Item>
    </Descriptions>
  );
};
