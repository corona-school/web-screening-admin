import React, { useContext, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input, Button } from "antd";
import ClipLoader from "react-spinners/ClipLoader";
import { ApiContext } from "../api/ApiContext";
import LoginAnimation from "../animatedIllustration/loginAnimation";

import classes from "./Login.module.less";

const Login = () => {
	const [loginText, setLoginText] = useState("Du wirst eingeloggt...");
	const [loading, setLoading] = useState(false);
	const { handleSubmit, control } = useForm();
	const context = useContext(ApiContext);

	const onSubmit: any = (data: { email: string; password: string }) => {
		setLoading(true);

		setTimeout(() => {
			setLoginText("Dein Cache wird zurückgesetzt...");
		}, 1000);

		context
			?.loginCall(data)
			.then(() => {
				setLoading(false);
			})
			.catch((err) => {
				setLoading(false);
			});
	};

	return (
		<div className={classes.loginContainer}>
			<form onSubmit={handleSubmit(onSubmit)} className={classes.formContainer}>
				<LoginAnimation />
				{loading ? (
					<div className={classes.loadingContainer}>
						<ClipLoader size={80} color={"#3d73dd"} loading={true} />
						{loginText}
					</div>
				) : (
					<>
						<Controller
							className={classes.customInput}
							as={Input}
							name="email"
							control={control}
							placeholder="email"
						/>
						<Controller
							className={classes.customInput}
							as={Input.Password}
							name="password"
							control={control}
							placeholder="password"
							visibilityToggle={true}
						/>
					</>
				)}
				<Button htmlType="submit" type="primary">
					Login
				</Button>
			</form>
		</div>
	);
};

export default Login;
