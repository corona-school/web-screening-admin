import React, { useContext } from "react";
import { Collapse, Input, Row, Col, Typography } from "antd";
import { useForm, Controller } from "react-hook-form";
import { ApiContext } from "../../api/ApiContext";

const { Text } = Typography;
const { TextArea } = Input;

const Form = ({ student }) => {
  const { control, register, handleSubmit, watch, errors } = useForm();

  const {
    postVerifyStudentCall,
    setCurrentStudentKey,
    getJobsCall
  } = useContext(ApiContext);

  const onSubmit = formData => {
    console.log(formData);
    let isVerified = false;
    const {
      isRealPerson,
      isStudent,
      isNotAbusing,
      isCapable,
      comment
    } = formData;
    if (isRealPerson && isStudent && isNotAbusing && isCapable) {
      isVerified = true;
    }
    postVerifyStudentCall({ comment, isVerified, email: student.email });
    setCurrentStudentKey([]);
    getJobsCall();
  };

  return (
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
      <Row style={{ marginTop: "1rem" }}>
        <Col span={16}>
          <Text>Die Person ist eine echte und lebende Person</Text>
        </Col>
        <Col span={8}>
          <input
            style={{ marginLeft: "1rem" }}
            type="checkbox"
            placeholder="isRealPerson"
            name="isRealPerson"
            ref={register}
            defaultChecked={false}
          />
        </Col>
      </Row>
      <Row>
        <Col span={16}>
          <Text>
            Die Person ist ein*e Student*in (Studentenausweis, oder Uni-Email +
            anderes Ausweisdokument gesehen)
          </Text>
        </Col>
        <Col span={8}>
          <input
            style={{ marginLeft: "1rem" }}
            type="checkbox"
            placeholder="isStudent"
            name="isStudent"
            ref={register}
            defaultChecked={false}
          />
        </Col>
      </Row>
      <Row>
        <Col span={16}>
          <Text>
            Die Person besitzt grundlegende fachliche Fähigkeiten Schüler*innen
            zu unterstützen
          </Text>
        </Col>{" "}
        <Col span={8}>
          <input
            style={{ marginLeft: "1rem" }}
            type="checkbox"
            placeholder="isCapable"
            name="isCapable"
            ref={register}
            defaultChecked={false}
          />
        </Col>
      </Row>
      <Row>
        <Col span={16}>
          <Text>
            Es ist, mit grundlegendem Menschenverstand, auszuschließen dass die
            Person jeglichen Missbrauch auf der Plattform verbreitet
          </Text>
        </Col>
        <Col span={8}>
          <input
            style={{ marginLeft: "1rem" }}
            type="checkbox"
            placeholder="isNotAbusing"
            name="isNotAbusing"
            ref={register}
            defaultChecked={false}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: "1rem" }}>
        <input type="submit" />
      </Row>
    </form>
  );
};

export default Form;
