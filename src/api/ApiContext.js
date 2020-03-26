import React, { Children, useEffect } from "react";
import axios from "axios";
import { baseUrl, getJobs, postChangeStatus } from "./urls.js";

const ApiContext = React.createContext();

const userData = [
  {
    name: "Leon",
    status: "waiting",
    link: "jitsi.com/leonerathi1",
    comment: "Test",
    id: 1234
  },
  {
    name: "Leon",
    status: "active",
    link: "jitsi.com/leonerathi2",
    comment: "Test",
    id: 3456
  },
  {
    name: "Leon",
    status: "completed",
    link: "jitsi.com/leonerathi3",
    comment: "Test",
    id: 2346
  },
  {
    name: "Leon",
    status: "rejected",
    link: "jitsi.com/leonerathi4",
    comment: "Test",
    id: 2344
  }
  ,
  {
    name: "Leon",
    status: "foobla",
    link: "jitsi.com/leonerathi4",
    comment: "Test",
    id: 2344
  }
];

const ApiContextComponent = ({ children }) => {
  useEffect(() => {
    getJobsCall();
  });

  const getJobsCall = () => {
    return axios
      .post(baseUrl + getJobs)
      .then(res => console.log(res))
      .catch(() => console.log("An Error occurred."));
  };

  const postChangeStatusCall = (email, isVerified) => {
    return axios
      .post(baseUrl + postChangeStatus, { email, isVerified })
      .then(res => (res ? true : false))
      .catch(console.log("An Error occurred"));
  };

  return (
    <ApiContext.Provider value={{ userData, postChangeStatusCall }}>
      {children}
    </ApiContext.Provider>
  );
};

export default ApiContextComponent;
export { ApiContext };
