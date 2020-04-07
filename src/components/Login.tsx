import React, { useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button } from "antd";
import { ApiContext } from "../api/ApiContext";
import LoginAnimation from "../animatedIllustration/loginAnimation";

import "./Login.less";

const Login = () => {
	const { handleSubmit, control } = useForm();
	const context = useContext(ApiContext);

	const onSubmit: any = (data: { email: string; password: string }) => {
		context?.loginCall(data);
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
