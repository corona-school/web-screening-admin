import React from "react";
import Routes from "./Routes";
import Header from "./Header";
import "./PageLayout.less";

const PageLayout = () => {
	return (
		<div className="pageContainer">
			<Header />
			<Routes />
		</div>
	);
};

export default PageLayout;
