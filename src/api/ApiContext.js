import React, { Children, useState, useEffect } from "react";
import axios from "axios";
import {
  baseUrl,
  getJobs,
  postChangeStatus,
  postVerifyStudent
} from "./urls.js";
import useInterval from "./interval.js";

const ApiContext = React.createContext();

const ApiContextComponent = ({ children }) => {
  let [userData, setUserData] = useState([]);
  const [timer, setTimer] = useState(true);
  let [currentStudentKey, setCurrentStudentKey] = useState([]);
  useInterval(() => getJobsCall(), 10000);
  useEffect(() => {
    getJobsCall();
  }, []);

  const getJobsCall = () => {
    // axios
    //   .get(baseUrl + getJobs)
    //   .then(({ data }) => setUserData(data))
    //   .catch(() => console.log("An Error occurred."));
    timer
      ? setUserData([
          {
            firstname: "Mateo",
            lastname: "Feicks",
            email: "m@feicks.de",
            time: 1585161353718,
            jitsi: "https://meet.jit.si/Mateo_Feicks_1585161353718",
            status: "completed",
            position: 0
          }
        ])
      : setUserData([
          {
            firstname: "Urlich",
            lastname: "Feicks",
            email: "m@feicks.de",
            time: 1585161353718,
            jitsi: "https://meet.jit.si/Mateo_Feicsdf",
            status: "waiting",
            position: 0
          },
          {
            firstname: "Leon",
            lastname: "Feicks",
            email: "m@feicks.de",
            time: 1585161353718,
            jitsi: "https://meet.jit.si/Mateo_Feicks_1585161353718",
            status: "completed",
            position: 0
          }
        ]);
    setTimer(!timer);
  };

  const postChangeStatusCall = data => {
    console.log(data);
    return axios
      .post(baseUrl + postChangeStatus, data)
      .then(({ data: resp }) => setUserData(resp))
      .catch(console.log("An Error occurred"));
  };

  const postVerifyStudentCall = data => {
    console.log(data);
    axios.post(baseUrl + postVerifyStudent, data).then(getJobsCall());
  };

  return (
    <ApiContext.Provider
      value={{
        userData,
        postChangeStatusCall,
        postVerifyStudentCall,
        setCurrentStudentKey,
        currentStudentKey
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export default ApiContextComponent;
export { ApiContext };
