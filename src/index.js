import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

const startApp = () => {
	ReactDOM.render(<App />, document.getElementById("root"));
};

startApp();
