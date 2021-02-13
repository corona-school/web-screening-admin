import React from 'react';
import moment from 'moment';
import 'moment/locale/de';
import {
  getScreeningType,
  ScreeningColorMap,
  StatusMap,
  ScreeningTypeText,
} from './data';
import { Button, Tag, Table, Modal } from 'antd';
import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import { IJobInfo, IScreenerInfo } from '../../api';
import Text from 'antd/lib/typography/Text';

const { confirm } = Modal;

interface Props {
  data: IJobInfo[];
  handleColumnClick: (job: IJobInfo) => void;
  user: IScreenerInfo;
  allJobs: IJobInfo[];
  handleRemoveJob: (email: string) => void;
  reverse: boolean;
}

const JobTable = ({
  data,
  handleColumnClick,
  user,
  allJobs,
  handleRemoveJob,
  reverse,
}: Props) => {
  const getTextFromJob = (job: IJobInfo) => {
    if (job.status === 'waiting') {
      if (job.assignedTo && job.assignedTo.email !== user.email) {
        return 'Übernehmen';
      }
    }
    if (
      job.status === 'completed' &&
      job.assignedTo &&
      job.assignedTo.email === user.email
    ) {
      return 'Ändern';
    }
    return null;
  };

  const showDeleteConfirm = (email: string) => {
    confirm({
      title: 'Willst du diesen Job wirklich löschen?',
      content:
        'Der Job wird von der Warteschalgen entfernt und der Student muss sich neu anmelden, um sich verifizieren zu lassen.',
      okText: 'Ja',
      okType: 'danger',
      cancelText: 'Nein',
      onOk() {
        handleRemoveJob(email);
      },
      onCancel() {},
    } as any);
  };

  const hasActiveStudent = () =>
    allJobs.some(
      (job) =>
        job.status === 'active' &&
        job.assignedTo &&
        job.assignedTo.email === user.email
    );

  const showConfirm = (job: IJobInfo) => {
    confirm({
      title: 'Willst du diesen Job übernehemen?',
      content: 'Ein andere Screener ist bereits eingetragen für diesen Job.',
      okText: 'Ja',
      cancelText: 'Abbrechen',
      onOk() {
        handleColumnClick(job);
      },
      onCancel() {
        console.log('Abbrechen');
      },
    });
  };

  const renderActions = (job: IJobInfo) => {
    const isSelfAssignedJob =
      job.assignedTo && job.assignedTo.email === user.email;

    const isWaitingAndHasNoActiveJob =
      job.status === 'waiting' && !hasActiveStudent();

    const isNotMyJob = job.assignedTo && job.assignedTo.email !== user.email;

    if (isSelfAssignedJob || isWaitingAndHasNoActiveJob) {
      return (
        <>
          <Button
            type="primary"
            icon={getTextFromJob(job) === null && <CheckOutlined />}
            style={{ margin: '4px' }}
            onClick={() =>
              isNotMyJob ? showConfirm(job) : handleColumnClick(job)
            }
          >
            {getTextFromJob(job)}
          </Button>
          <Button
            style={{ margin: '4px' }}
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(job.data.email)}
          />
        </>
      );
    }
  };

  const renderScreener = (screener: IScreenerInfo | undefined) => {
    if (!screener) {
      return '-';
    }
    if (screener.email === user.email) {
      return (
        <Tag color={'blue'} key={screener.email}>
          Du
        </Tag>
      );
    }
    return (
      <span>
        {screener.firstname} {screener.lastname}
      </span>
    );
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'lastName',
      key: 'lastName',
      render: (_: string, job: IJobInfo) => {
        return (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Text>{`${job.data.firstName} ${job.data.lastName}`}</Text>
            <Text type="secondary">{job.data.email}</Text>
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (tag: string) => (
        <Tag color={StatusMap.get(tag)} key={tag}>
          {tag.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Art des Screenings',
      dataIndex: 'kind',
      key: 'kind',
      render: (_: string, job: IJobInfo) => {
        return getScreeningType(job).map((type) => {
          return (
            <Tag
              color={ScreeningColorMap.get(type)}
              key={type}
              style={{ margin: '4px' }}
            >
              {ScreeningTypeText.get(type)}
            </Tag>
          );
        });
      },
    },
    {
      title: 'Zeit',
      dataIndex: 'timeWaiting',
      key: 'time',
      render: (time: number) => <span>{moment(time).fromNow()}</span>,
      defaultSortOrder: reverse ? 'descend' : 'ascend',
      sorter: (a: any, b: any) => a.time - b.time,
    },
    {
      title: 'Video-Link',
      dataIndex: 'jitsi',
      key: 'jitsi',
      render: (_: string, job: IJobInfo) => (
        <a href={job.data.jitsi} target="blank">
          Link
        </a>
      ),
    },
    {
      title: 'Screener',
      dataIndex: 'screener',
      key: 'screener',
      render: (_: string, job: IJobInfo) => renderScreener(job.assignedTo),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (_: string, job: IJobInfo) => renderActions(job),
    },
  ];

  return (
    <Table
      expandable={{
        expandedRowRender: (job) => {
          return (
            <div>
              {job.data.msg && (
                <p style={{ margin: '4px' }}>"{job.data.msg}"</p>
              )}
              <div style={{ margin: '4px' }}>
                {job.data.subjects.map((subject) => (
                  <Tag style={{ margin: '4px' }} key={subject.name}>
                    {subject.name}
                  </Tag>
                ))}
              </div>
            </div>
          );
        },
      }}
      columns={columns as any}
      dataSource={data}
    />
  );
};
export default JobTable;
