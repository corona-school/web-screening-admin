import React, { useContext, useEffect, useState } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import { ApiContext } from '../api/ApiContext';
import * as Sentry from '@sentry/browser';

import Screening from './screening';
import Navigation from './navigation/Navigation';
import UserList from './userList/UserList';
import ScreenerList from './ScreenerList';
import Dashboard from './dashboard/Dashboard';
import OpeningHours from './openingHours/OpeningHours';
import Courses from './courses/Courses';
import StudentInfo from './student/StudentInfo';
import * as FullStory from '@fullstory/browser';
import Login from './Login';

import './Routes.less';

const Routes = () => {
  const {
    userIsLoggedIn,
    setUserIsLoggedIn,
    setUser,
    isScreenerListOpen,
    checkLoginStatus,
  } = useContext(ApiContext)!;

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userIsLoggedIn) {
      checkLoginStatus()
        .then(({ data }) => {
          console.log('Logged in with ', data);
          setUser(data);

          try {
            FullStory.identify(data.email, {
              displayName: `${data.firstname} ${data.lastname}`,
              email: data.email,
            });
            Sentry.configureScope((scope) => {
              scope.setUser({ email: data.email, id: data.email });
              scope.setTag('user', data.email);
            });
          } catch (e) {
            console.log('Failed to initialize logging', e);
          }

          setUserIsLoggedIn(true);
          setLoading(false);
        })
        .catch((err: any) => {
          console.error(err);
          setUser(null);
          setUserIsLoggedIn(false);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return (
      <div className="loadingContainer">
        <ClipLoader size={120} color={'#25b864'} loading={loading} />
      </div>
    );
  }

  if (!loading && !userIsLoggedIn) {
    return <Login />;
  }

  return (
    <Switch>
      <Route path="/" exact>
        <Redirect to="/screening" />
      </Route>
      <Route path="/dashboard">
        <div className="main">
          <Navigation />
          <Dashboard />
          {isScreenerListOpen && <ScreenerList />}
        </div>
      </Route>

      <Route path="/screening/:email/:room">
        <Screening />
      </Route>
      <Route path="/screening">
        <div className="main">
          <Navigation />
          <UserList />
          {isScreenerListOpen && <ScreenerList />}
        </div>
      </Route>

      <Route path="/opening-hours">
        <div className="main">
          <Navigation />
          <OpeningHours />
        </div>
      </Route>
      <Route path="/student/:email">
        <div className="main">
          <Navigation />
          <StudentInfo />
        </div>
      </Route>
      <Route path="/courses">
        <div className="main">
          <Navigation />
          <Courses />
          {isScreenerListOpen && <ScreenerList />}
        </div>
      </Route>
    </Switch>
  );
};

export default Routes;
