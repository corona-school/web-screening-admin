import React from "react";
import MainContent from "./components/MainContent";
import "./App.css";

import ApiContext from "./api/ApiContext";

const App = () => (
  <>
    <ApiContext>
      <MainContent />
    </ApiContext>
  </>
);

export default App;
