import React, { useContext } from "react";
import { Layout, Typography } from "antd";
import { ApiContext } from "../../api/ApiContext";
import Routes from "../../routing/Routes";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const MainContent = () => {
  const { studentData, currentStudentKey } = useContext(ApiContext);

  return (
    <>
      <Layout>
        <Header
          style={{
            position: "fixed",
            zIndex: 1,
            width: "100%",
            padding: "1 rem"
          }}
        >
          <Title style={{ color: "white" }}>Corona School Screening</Title>
        </Header>
        <Routes />
      </Layout>
    </>
  );
};

export default MainContent;
