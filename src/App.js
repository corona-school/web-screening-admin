import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import PageLayout from "./components/PageLayout";
import "./App.css";

import ApiContext from "./api/ApiContext";

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
