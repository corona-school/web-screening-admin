import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import PageLayout from "./components/PageLayout";
import HttpsRedirect from "react-https-redirect";
import * as Sentry from "@sentry/browser";
import ApiContext from "./api/ApiContext";
import * as FullStory from "@fullstory/browser";

if (process.env.NODE_ENV === "production") {
	FullStory.init({ orgId: "VSTAQ", devMode: !process.env.NODE_ENV });
	Sentry.init({
		dsn: process.env.REACT_APP_SENTRY_URL,
	});
}

const App = () => (
	<HttpsRedirect>
		<Router>
			<ApiContext>
				<PageLayout />
			</ApiContext>
		</Router>
	</HttpsRedirect>
);

export default App;
