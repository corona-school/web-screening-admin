import React from 'react';
import moment from 'moment';
import 'moment/locale/de';
import { StatusMap } from './data';
import { Button, Tag, Table, Modal } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const JobTable = ({
  data,
  handleColumnClick,
  user,
  allJobs,
  handleRemoveJob,
  reverse,
}) => {
  const getTextFromJob = (job) => {
    if (job.status === 'waiting') {
      if (job.assignedTo && job.assignedTo.email !== user.email) {
        return 'Übernehmen';
      }
      return 'Verifizieren';
    }

    return 'Ergebnis';
  };

  const showDeleteConfirm = (email) => {
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
    });
  };

  const hasActiveStudent = () =>
    allJobs.some(
      (job) =>
        job.status === 'active' &&
        job.assignedTo &&
        job.assignedTo.email === user.email
    );

  const showConfirm = (job) => {
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

  const renderActions = (job) => {
    const isSelfAssignedJob =
      job.assignedTo && job.assignedTo.email === user.email;

    const isWaitingAndHasNoActiveJob =
      job.status === 'waiting' && !hasActiveStudent();

    const isNotMyJob = job.assignedTo && job.assignedTo.email !== user.email;

    if (isSelfAssignedJob || isWaitingAndHasNoActiveJob) {
      return (
        <>
          <Button
            style={{ width: '116px' }}
            onClick={() =>
              isNotMyJob ? showConfirm(job) : handleColumnClick(job)
            }
          >
            {getTextFromJob(job)}
          </Button>
          <Button
            style={{ width: '36px' }}
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(job.data.email)}
          />
        </>
      );
    }
  };

  const renderScreener = (screener) => {
    if (!screener) {
      return;
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
      render: (lastName, job) => {
        return `${job.data.firstName} ${job.data.lastName}`;
      },
    },
    {
      title: 'E-Mail',
      dataIndex: 'data.email',
      key: 'email',
      render: (lastName, job) => job.data.email,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (tag) => (
        <Tag color={StatusMap.get(tag)} key={tag}>
          {tag.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Zeit',
      dataIndex: 'timeWaiting',
      key: 'time',
      render: (time) => <span>{moment(time).fromNow()}</span>,
      defaultSortOrder: reverse ? 'descend' : 'ascend',
      sorter: (a, b) => a.time - b.time,
    },
    {
      title: 'Video-Link',
      dataIndex: 'jitsi',
      key: 'jitsi',
      render: (_, job) => (
        <a href={job.data.jitsi} target="blank">
          Link
        </a>
      ),
    },
    {
      title: 'Screener',
      dataIndex: 'screener',
      key: 'screener',
      render: (_, job) => renderScreener(job.assignedTo),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text, job) => renderActions(job),
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
      columns={columns}
      dataSource={data}
    />
  );
};
export default JobTable;
