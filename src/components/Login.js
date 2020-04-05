import React, { useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button } from "antd";
import { ApiContext } from "../api/ApiContext";
import LoginAnimation from "../animatedIllustration/loginAnimation";

import "./Login.less";

const Login = () => {
	const { register, handleSubmit, control } = useForm();
	const { loginCall } = useContext(ApiContext);

	const onSubmit = (data) => {
		loginCall(data);
	};

	return (
		<div className="container">
			<form onSubmit={handleSubmit(onSubmit)} className="formContainer">
				<LoginAnimation />
				<Controller
					className="customInput"
					as={Input}
					name="email"
					control={control}
					placeholder="email"
					ref={register({ required: true, pattern: /^\S+@\S+$/i })}
				/>
				<Controller
					className="customInput"
					as={Input.Password}
					name="password"
					control={control}
					placeholder="password"
					visibilityToggle={true}
				/>
				<Button htmlType="submit" type="primary">
					Login
				</Button>
			</form>
		</div>
	);
};

export default Login;
