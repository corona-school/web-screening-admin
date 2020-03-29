import React, { useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Row, Col } from "antd";

import { ApiContext } from "../../api/ApiContext";

export default function Login() {
  const { register, handleSubmit, errors, control } = useForm();
  const { loginCall } = useContext(ApiContext);

  const onSubmit = data => {
    loginCall(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Row style={{ marginTop: "1rem" }}>
        <Col span={8}>
          <Controller
            as={Input}
            name="email"
            control={control}
            placeholder="email"
            ref={register({ required: true, pattern: /^\S+@\S+$/i })}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: "1rem" }}>
        <Col span={8}>
          <Controller
            as={Input.Password}
            name="password"
            control={control}
            placeholder="password"
            visibilityToggle={true}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: "1rem", marginBottom: "2rem" }}>
        <input type="submit" />
      </Row>
    </form>
  );
}
