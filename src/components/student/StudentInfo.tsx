import React, { useState, useContext, useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import classes from './StudentInfo.module.less';
import useStudent, { IStudentScreeningResult } from '../../api/useStudent';
import {
  Descriptions,
  Spin,
  Typography,
  Tag,
  Button,
  Select,
  Input,
  Radio,
} from 'antd';
import { PlusOutlined, SaveOutlined } from '@ant-design/icons';
import { ApiContext } from '../../api/ApiContext';
import SubjectList from '../userList/SubjectList';
import { createSubjects, subjectToString } from '../../utils/subjectUtils';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

interface MatchParams {
  email: string | undefined;
}

const StudentInfo = (props: RouteComponentProps<MatchParams>) => {
  const context = useContext(ApiContext);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [
    screeningResult,
    setScreeningResult,
  ] = useState<IStudentScreeningResult | null>(null);
  const [knowsFrom, setKnowsFrom] = useState('13');
  const email = props.match.params.email;

  if (!email) {
    props.history.push('/');
  }

  useEffect(() => {
    setOpenEdit(false);
  }, [email]);

  const { studentInfo, loading, save } = useStudent(email || '');

  if (loading || !studentInfo) {
    return (
      <div
        className={classes.box}
        style={{ justifyContent: 'center', alignItems: 'center' }}
      >
        <Spin size="large"></Spin>
      </div>
    );
  }

  const changeJob = (key: string, value: any) => {
    if (!screeningResult) {
      return;
    }
    const newResult: IStudentScreeningResult = {
      ...screeningResult,
      [key]: value,
    };
    setScreeningResult(newResult);
  };

  const renderEdit = () => {
    return (
      <div className={classes.editContainer}>
        <div className="label">Feedback des Studenten: </div>
        <TextArea
          rows={2}
          placeholder="Feedback des Studenten"
          value={screeningResult?.feedback}
          onChange={(e) => {
            if (!screeningResult) {
              return;
            }
            const newResult: IStudentScreeningResult = {
              ...screeningResult,
              feedback: e.target.value,
            };
            setScreeningResult(newResult);
          }}
        />
        <div className="label">Wie hat der Student von uns erfahren?</div>
        <Select
          onChange={(v) => {
            setKnowsFrom(v);
            if (v !== '13') {
              changeJob('knowcsfrom', v);
            }
          }}
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
            value={screeningResult?.knowscsfrom}
            onChange={(e) => changeJob('knowcsfrom', e.target.value)}
          />
        )}

        <div className="label">Kommentar: </div>
        <TextArea
          style={{ marginBottom: '16px' }}
          rows={2}
          value={screeningResult?.commentScreener}
          placeholder="Hier ein Kommentar (Optional)"
          onChange={(e) => changeJob('commentScreener', e.target.value)}
        />
        <div className="label">Fächer: </div>
        <SubjectList
          subjects={createSubjects(screeningResult?.subjects || '')}
          setSubjects={(subjects) => {
            changeJob('subjects', subjectToString(subjects));
          }}
        />
        <div style={{ marginTop: '8px' }}>
          <Radio.Group
            value={screeningResult?.verified ? 'a' : 'b'}
            onChange={(change) => {
              if (change.target.value === 'a') {
                changeJob('verified', true);
                return;
              }
              changeJob('verified', false);
            }}
          >
            <Radio.Button value="a">Freischalten</Radio.Button>
            <Radio.Button value="b">Ablehnen</Radio.Button>
          </Radio.Group>
        </div>
        <Button
          style={{ margin: '8px 0px' }}
          type="primary"
          onClick={() => {
            if (screeningResult) {
              save(screeningResult);
            }
          }}
        >
          <SaveOutlined />
          Save
        </Button>
      </div>
    );
  };

  return (
    <div className={classes.box}>
      <div className={classes.container}>
        <Title level={4} style={{ color: '#6c757d' }}>
          Studenten Information
        </Title>
        <Descriptions layout="horizontal" column={2}>
          <Descriptions.Item label="Name">
            {studentInfo.firstname} {studentInfo.lastname}
          </Descriptions.Item>
          <Descriptions.Item label="E-Mail">
            {studentInfo.email}
          </Descriptions.Item>

          <Descriptions.Item label="Telefonnummer">
            {studentInfo.phone ? studentInfo.phone : '-'}
          </Descriptions.Item>

          <Descriptions.Item label="Status">
            {studentInfo.verified ? (
              <Tag color="green">Verifiziert</Tag>
            ) : (
              <Tag>-</Tag>
            )}
          </Descriptions.Item>
          <Descriptions.Item label="Nachricht">
            {studentInfo.msg ? studentInfo.msg : '-'}
          </Descriptions.Item>
        </Descriptions>
        <Button
          onClick={() => {
            if (!context || !context.user || !context.user.email) {
              return;
            }
            const initialResult: IStudentScreeningResult = {
              verified: true,
              screenerEmail: context.user.email,
              subjects: studentInfo.subjects,
            };

            setScreeningResult(initialResult);
            setOpenEdit(true);
          }}
          type="primary"
          style={{ width: '180px' }}
          icon={<PlusOutlined />}
        >
          Manuel verifizieren
        </Button>
      </div>
      <div>{openEdit && renderEdit()}</div>
    </div>
  );
};

export default withRouter(StudentInfo);
