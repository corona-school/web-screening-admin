/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';

import { pure } from 'recompose';
import OverviewAnalysis from './OverviewAnalysis';
import JobPerDay from './JobPerDay';
import JobPerTime from './JobPerTime';
import OverviewScreenings from './OverviewScreenings';

import './dashboard.less';
import useStatistics from '../../api/useStatistics';

const Dashboard = () => {
  const { statistics } = useStatistics();
  return (
    <div className="dashboard-container">
      <div className="dashboard">
        <OverviewAnalysis statistics={statistics} />
        <JobPerDay statistics={statistics} />
        <JobPerTime statistics={statistics} />
        <OverviewScreenings statistics={statistics} />
      </div>
    </div>
  );
};

export default pure(Dashboard);
