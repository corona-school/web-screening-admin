import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import "./index.less";
import App from "./App";
import Bugsnag from "@bugsnag/js";
import BugsnagPluginReact from "@bugsnag/plugin-react";

Bugsnag.start({
	apiKey: "44993ed02460c98ff098ea82215a58e6",
	plugins: [new BugsnagPluginReact()],
});

const ErrorBoundary = (Bugsnag.getPlugin("react") as any).createErrorBoundary(
	React
);

const startApp = () => {
	ReactDOM.render(
		<ErrorBoundary>
			<App />
		</ErrorBoundary>,
		document.getElementById("root")
	);
};

startApp();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
