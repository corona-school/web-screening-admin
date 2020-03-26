import React, { Children, useEffect } from "react";
import axios from "axios";
import { baseUrl, jobs } from "./urls.js";

const ApiContext = React.createContext();

const userData = [
  {
    name: "Leon",
    status: 1,
    link: "jitsi.com/leonerathi1",
    comment: "Test",
    id: 1234
  },
  {
    name: "Leon",
    status: 2,
    link: "jitsi.com/leonerathi2",
    comment: "Test",
    id: 3456
  },
  {
    name: "Leon",
    status: 3,
    link: "jitsi.com/leonerathi3",
    comment: "Test",
    id: 2346
  },
  {
    name: "Leon",
    status: 4,
    link: "jitsi.com/leonerathi4",
    comment: "Test",
    id: 2344
  }
];

const ApiContextComponent = ({ children }) => {
  useEffect(() => {
    getContiousUserData();
  });

  const getContiousUserData = () => {
    return axios
      .post(baseUrl + jobs)
      .catch(() => console.log("An Error accured."));
  };

  return <ApiContext.Provider value={userData}>{children}</ApiContext.Provider>;
};

export default ApiContextComponent;
export { ApiContext };
