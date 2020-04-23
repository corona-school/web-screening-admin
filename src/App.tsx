import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import PageLayout from "./components/PageLayout";
import * as Sentry from "@sentry/browser";
import ApiContext from "./api/ApiContext";
import LogRocket from "logrocket";

if (process.env.NODE_ENV === "production") {
	LogRocket.init(process.env.REACT_APP_LOG_ROCKET || "");
	Sentry.init({
		dsn: process.env.REACT_APP_SENTRY_URL,
	});
}

const App = () => (
	<>
		<Router>
			<ApiContext>
				<PageLayout />
			</ApiContext>
		</Router>
	</>
);

export default App;
