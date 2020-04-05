import React from "react";
import Routes from "../routing/Routes";
import "./PageLayout.less";

import Header from "./Header";

const PageLayout = () => {
	return (
		<>
			<div className="pageContainer">
				<Header />

				<Routes />
			</div>
		</>
	);
};

export default PageLayout;
