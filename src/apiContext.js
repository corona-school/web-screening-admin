import { Children } from "react";
import axios from "axios";

const apiContext = React.createContext();

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

const ApiContext = ({ children }) => {
  const getContiousUserData = () => {
    return axios
      .get()
      .then()
      .catch(() => userData);
  };

  return (
    <apiContext.Provider value={getContiousUserData}>
      {children}
    </apiContext.Provider>
  );
};
