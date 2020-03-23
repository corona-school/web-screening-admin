import React, { useState } from "react";
import { Collapse, Checkbox, Input, Row, Col, Typography } from "antd";
import {
  ExclamationCircleFilled,
  CloseCircleFilled,
  CheckCircleFilled,
  QuestionCircleFilled
} from "@ant-design/icons";
import { useForm, Controller } from "react-hook-form";

const { Panel } = Collapse;
const { Text } = Typography;
const { TextArea } = Input;

const UserList = ({ userData }) => {
  const [expandIconPosition, setExpandIconPosition] = useState();
  const [isAccepted, setIsAccepted] = useState(true);
  const { control, register, handleSubmit, watch, errors } = useForm();

  const genExtra = even => {
    switch (even) {
      case 1:
        return <ExclamationCircleFilled style={{ color: "orange" }} />;
      case 2:
        return <CloseCircleFilled style={{ color: "red" }} />;
      case 3:
        return <CheckCircleFilled style={{ color: "green" }} />;
      default:
        return <QuestionCircleFilled style={{ color: "gray" }} />;
    }
  };

  const onSubmit = data => {
    console.log(data);
  };

  const callLink = link => {
    // window.open(
    //   "https://react-hook-form.com/get-started#WorkwithUIlibrary",
    //   "_blank"
    // );
    console.log(link);
  };

  userData = [
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

  return (
    <div>
      <Collapse
        expandIconPosition={expandIconPosition}
        onChange={callLink}
        accordion={true}
      >
        {userData.map(user => {
          return (
            <Panel
              header={user.name}
              key={user.link}
              extra={genExtra(user.status)}
            >
              <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Row>
                    <Text>Kommentare</Text>
                  </Row>
                  <Row>
                    <Controller
                      as={TextArea}
                      name="comment"
                      control={control}
                      placeholder="Hast du irgendwelche Anmerkungen?"
                    />
                  </Row>
                  <Row>
                    <Text>Den Studenten Akzeptieren</Text>
                    <input
                      style={{ marginLeft: "1rem" }}
                      type="checkbox"
                      placeholder="isAccepted"
                      name="isAccepted"
                      ref={register}
                      defaultChecked={true}
                      label="Studenten Annehmen"
                    />
                  </Row>
                  <Row style={{ marginTop: "1rem" }}>
                    <input type="submit" />
                  </Row>
                </form>
              </div>
            </Panel>
          );
        })}
      </Collapse>
    </div>
  );
};

export default UserList;
