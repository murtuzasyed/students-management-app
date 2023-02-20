import React from "react";
import "./App.css";
import {Layout,  theme} from "antd";

import StudentList from './components/StudentList';

const { Header, Content, Footer } = Layout;

function App() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  return (
    <div className="App">
      <Layout style={{ minHeight: "100vh" }}>
          <Header style={{ padding: 0, background: colorBgContainer, textAlign:"center" }}>Student Management App</Header>
          <Content style={{ margin: "0 16px" }}>
            <StudentList />
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Powered by Ant Design ©2018. Created by Murtuza Syed
          </Footer>
      </Layout>
    </div>
  );
}

export default App;
