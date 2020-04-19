import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import PageLayout from "./components/PageLayout";
import * as Sentry from "@sentry/browser";
import ApiContext from "./api/ApiContext";

Sentry.init({
	dsn: process.env.REACT_APP_SENTRY_URL,
});

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
