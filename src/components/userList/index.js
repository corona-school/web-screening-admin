import React, { useState, useContext } from "react";
import { Collapse, Input, Row, Col, Typography } from "antd";
import {
  ExclamationCircleFilled,
  CloseCircleFilled,
  CheckCircleFilled,
  QuestionCircleFilled
} from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";
import Form from "./form";

import { ApiContext } from "../../api/ApiContext";

const { Panel } = Collapse;
const { Text } = Typography;
const { TextArea } = Input;

const UserList = ({ userData, currentStudentKey }) => {
  const [activeKey, setActiveKey] = useState(currentStudentKey);
  const [isAccepted, setIsAccepted] = useState(true);
  const { control, register, handleSubmit, watch, errors } = useForm();

  const {
    postVerifyStudentCall,
    setCurrentStudentKey,
    postChangeStatusCall
  } = useContext(ApiContext);

  const genExtra = status => {
    switch (status) {
      case "waiting":
        return <QuestionCircleFilled style={{ color: "gray" }} />;
      case "active":
        return <ExclamationCircleFilled style={{ color: "orange" }} />;
      case "completed":
        return <CheckCircleFilled style={{ color: "green" }} />;
      case "rejected":
        return <CloseCircleFilled style={{ color: "red" }} />;
      default:
        console.error("unhandled user state", status);
        return;
    }
  };

  const callLink = link => {
    // if (
    //   userData[index].status !== "completed" &&
    //   userData[index].status !== "rejected"
    // )
    // window.open(userData[index].jitsi, "_blank");
    postChangeStatusCall();
    setCurrentStudentKey(link);
  };

  return (
    <div>
      <Collapse
        activeKey={currentStudentKey}
        onChange={callLink}
        accordion={true}
      >
        {userData.map(student => {
          return (
            <Panel
              header={`${student.firstname} ${student.lastname}`}
              key={student.jitsi}
              extra={genExtra(student.status)}
            >
              <Form student={student} />
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
};

export default UserList;
