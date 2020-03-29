import React, { Children, useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import {
  baseUrl,
  getJobs,
  login,
  postChangeStatus,
  postVerifyStudent
} from "./urls.js";
import useInterval from "./interval.js";

const ApiContext = React.createContext();
axios.defaults.withCredentials = true;

const ApiContextComponent = ({ children, history }) => {
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(true);
  const [studentData, setStudentData] = useState([]);
  const [timer, setTimer] = useState(true);
  let [currentStudentKey, setCurrentStudentKey] = useState([]);
  // useInterval(() => getJobsCall(), 10000);
  useEffect(() => {
    getJobsCall();
  }, []);

  const loginCall = data => {
    console.log(data);
    axios
      .post(baseUrl + login, data)
      .then(test => {
        console.log("logged in");
        setUserIsLoggedIn(true);
        history.push("/screening");
      })
      .catch(() => {
        console.log("login Failed");
      });
  };

  const getJobsCall = () => {
    console.log("get jobs");
    axios
      .get(baseUrl + getJobs)
      .then(({ data }) => setStudentData(data))
      .catch(() => console.log("Get Jobs failed."));
  };

  const postChangeStatusCall = data => {
    axios
      .post(baseUrl + postChangeStatus, data)
      .then(resp => console.log(resp))
      .catch(console.log("Change Status failed"));
  };

  const postVerifyStudentCall = data => {
    console.log(data);
    axios
      .post(baseUrl + postVerifyStudent, data)
      .then(getJobsCall())
      .catch(() => console.log("verify failed"));
  };

  return (
    <ApiContext.Provider
      value={{
        getJobsCall,
        studentData,
        postChangeStatusCall,
        postVerifyStudentCall,
        setCurrentStudentKey,
        currentStudentKey,
        userIsLoggedIn,
        loginCall
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export default withRouter(ApiContextComponent);
export { ApiContext };
