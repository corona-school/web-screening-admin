import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import MainContent from "./components/MainContent";
import "./App.css";

import ApiContext from "./api/ApiContext";

const App = () => (
  <>
    <Router>
      <ApiContext>
        <MainContent />
      </ApiContext>
    </Router>
  </>
);

export default App;
