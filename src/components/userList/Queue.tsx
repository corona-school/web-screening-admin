import React, { useContext, useState, useEffect } from 'react';
import classes from './Queue.module.less';
import { Tabs, message, Typography, Modal } from 'antd';
import { ApiContext, IJobInfo } from '../../api/ApiContext';
import { Keys, KeyMap, TabMap } from './data';
import JobTable from './JobTable';
import FeedbackModal from './FeedbackModal';
import useInterval from '../../api/interval';
import renderStatus from '../RenderStatus';

import './UserList.less';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import VerifyStudent from "../../utils/studentVerification";

const { confirm } = Modal;
const { TabPane } = Tabs;
const { Title } = Typography;

const Queue = (props: RouteComponentProps) => {
  const context = useContext(ApiContext);
  const [selectedJob, setSelectedJob] = useState<IJobInfo | null>(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [filterType, setFilterType] = useState(2);

  useEffect(() => {
    if (!selectedJob) {
      setModalOpen(false);
    }
  }, [selectedJob]);

  useInterval(() => {
    if (context?.userIsLoggedIn && !context?.isSocketConnected) {
      getJobsCall();
    }
  }, 1000);

  if (!context) {
    return null;
  }

  const {
    postChangeStatusCall,
    getJobsCall,
    handleRemoveJob,
    studentData,
    user,
  } = context;

  if (!user) {
    return null;
  }

  const startVideoCall = (selectedJob: IJobInfo) => {
    const job: IJobInfo = { ...selectedJob, status: 'active' };
    postChangeStatusCall(job.data, job.id, 'SET_ACTIVE')
      .then((_newJob: IJobInfo) => {
        setModalOpen(false);
        const room = new URL(job.data.jitsi).pathname;
        props.history.push(`screening/${job.data.email}${room}`);
        message.success('Der Student wurde zum VideoCall eingeladen.');
      })
      .catch((_err: any) => {
        setSelectedJob(null);
        setModalOpen(false);
        message.error('Der VideoCall konnte nicht gestartet werden.');
      });
  };

  const completeJob = (job: IJobInfo, isVerified: boolean) => {
    setModalOpen(false);
    setFilterType(isVerified ? 4 : 5);

    VerifyStudent({ student: job.data, decision: isVerified });

    postChangeStatusCall(job.data, job.id, isVerified ? 'SET_DONE' : 'SET_REJECTED')
      .then(() => message.success('Änderungen wurden erfolgreich gespeichert.'))
      .catch(() =>
        message.error('Änderungen konnten nicht gespeichert werden')
      );
  };

  const handleColumnClick = (job: IJobInfo) => {
    if (job.status !== 'waiting') {
      setSelectedJob(job);
      setModalOpen(true);
      return;
    }

    if (!job) {
      return;
    }

    setSelectedJob(job);
    confirm({
      title: 'Willst du die Verifzierung beginnen?',
      icon: <ExclamationCircleOutlined />,
      content:
        'Du wirst automatisch zum Jitsi-Call weitergeleitet und als Screener eingetragen.',
      onOk() {
        startVideoCall(job);
      },
      onCancel() {},
    });
  };

  const data: IJobInfo[] = studentData
    .map((data, index) => ({ key: index, ...data }))
    .filter((data) => {
      if (filterType !== 1) {
        return data.status === KeyMap.get(filterType)?.toLowerCase();
      }
      return true;
    })
    .sort((a, b) => a.timeWaiting - b.timeWaiting)
    .filter((job) => {
      if (
        job.status !== 'waiting' &&
        job.status !== 'active' &&
        job.assignedTo
      ) {
        return job.assignedTo.email === user?.email;
      }
      return true;
    });

  return (
    <div className={classes.queue}>
      <div className={classes.header}>
        <Title style={{ color: '#6c757d', marginTop: 0 }} level={4}>
          Warteschlange
        </Title>
        {renderStatus(context)}
      </div>
      <Tabs
        defaultActiveKey={`${filterType}`}
        activeKey={`${filterType}`}
        onChange={(key) => {
          setFilterType(parseInt(key));
        }}
      >
        {Keys.map((index) => {
          return (
            <TabPane tab={TabMap.get(index)} key={index.toString()}>
              <JobTable
                reverse={filterType === 2 ? false : true}
                handleRemoveJob={handleRemoveJob}
                allJobs={studentData}
                data={data}
                handleColumnClick={handleColumnClick}
                user={user}
              />
            </TabPane>
          );
        })}
      </Tabs>
      {selectedJob && (
        <FeedbackModal
          removeJob={context.handleRemoveJob}
          isModalOpen={isModalOpen}
          closeModal={() => setModalOpen(false)}
          completeJob={completeJob}
          startVideoCall={startVideoCall}
          selectedJob={selectedJob}
          setSelectedJob={(job: IJobInfo) => setSelectedJob(job)}
        />
      )}
    </div>
  );
};

export default withRouter(Queue);
