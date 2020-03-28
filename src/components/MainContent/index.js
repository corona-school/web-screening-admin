import React, { useContext } from "react";
import { Layout, Typography } from "antd";
import { ApiContext } from "../../api/ApiContext";
import UserList from "../userList";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const MainContent = () => {
  const { userData, currentStudentKey } = useContext(ApiContext);

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
        <Content
          className="site-layout"
          style={{ padding: "0 50px", marginTop: 64 }}
        >
          <div
            className="site-layout-background"
            style={{ padding: 24, minHeight: 380 }}
          >
            <UserList
              currentStudentKey={currentStudentKey}
              userData={userData}
            />
          </div>
        </Content>
      </Layout>
    </>
  );
};

export default MainContent;
