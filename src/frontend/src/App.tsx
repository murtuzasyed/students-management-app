import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  PlusOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import {
  Button,
  Layout,
  Menu,
  Spin,
  Table,
  Tag,
  theme,
  Badge,
  Avatar,
} from "antd";
import openNotificationWithIcon, { NotificationType } from "./Notification";
import NewStudentForm, { INewStudentFormData } from "./NewStudentForm";
import { addStudent, getStudents, deleteStudent } from "./client";
import DeleteStudent from "./DeleteStudent";

export type StudentData = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  location: string;
};
type MenuItem = Required<MenuProps>["items"][number];
function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}
const { Header, Content, Footer, Sider } = Layout;
const items: MenuItem[] = [
  getItem("Option 1", "1", <PieChartOutlined />),
  getItem("Option 2", "2", <DesktopOutlined />),
  getItem("User", "sub1", <UserOutlined />, [
    getItem("Tom", "3"),
    getItem("Bill", "4"),
    getItem("Alex", "5"),
  ]),
  getItem("Team", "sub2", <TeamOutlined />, [
    getItem("Team 1", "6"),
    getItem("Team 2", "8"),
  ]),
  getItem("Files", "9", <FileOutlined />),
];

const tableColumns = (onStudentsUpdated: () => void) => [
  {
    title: "",
    dataIndex: "avatar",
    key: "avatar",
    render: (text: string, student: StudentData) => (
      <Avatar>{`${student.firstname[0]}${student.lastname[0]}`}</Avatar>
    ),
  },
  {
    title: "Firstname",
    dataIndex: "firstname",
    key: "firstname",
  },
  {
    title: "Lastname",
    dataIndex: "lastname",
    key: "lastname",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Gender",
    dataIndex: "gender",
    key: "gender",
  },
  {
    title: "Actions",
    dataIndex: "modify",
    key: "modify",
    render: (text: string, student: StudentData) => (
      <DeleteStudent
        onDelete={() => {
          deleteStudent(student.id)
            .then(() => {
              onStudentsUpdated();
              openNotificationWithIcon(
                NotificationType.SUCCESS,
                "Delete success",
                `Student ${student.firstname}, ${student.lastname} was deleted succesfully!`
              );
            })
            .catch((err) => {
              openNotificationWithIcon(
                NotificationType.ERROR,
                "Delete failed",
                err.message,
                "bottomRight"
              );
            });
        }}
      />
    ),
  },
];
function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAddStudentDrawer, setShowAddStudentDrawer] = useState(false);
  const [studentsUpdated, setStudentsUpdated] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  useEffect(() => {
    setLoading(true);

    getStudents()
      .then((data: [StudentData]) => {
        setStudents(data);
      })
      .catch((error) => {
        openNotificationWithIcon(
          NotificationType.ERROR,
          "Error Loading Students",
          error.message
        );
      })
      .finally(() => setLoading(false));
  }, [studentsUpdated]);
  return (
    <div className="App">
      <Layout style={{ minHeight: "100vh" }}>
        <Layout className="site-layout">
          <Header style={{ padding: 0, background: colorBgContainer, textAlign:"center" }}>Student Management App</Header>
          <Content style={{ margin: "0 16px" }}>
            <>
              {loading && <Spin />}
              {students && (
                <Table
                  bordered
                  rowKey={(student) => student.id}
                  title={() => (
                    <>
                      <Tag>Number of students</Tag>
                      <Badge
                        className="site-badge-count-4"
                        count={students.length}
                        showZero
                      />
                      <br />
                      <br />
                      <Button
                        type="primary"
                        onClick={() => {
                          setStudentsUpdated(!studentsUpdated);
                          setShowAddStudentDrawer(true);
                        }}
                        shape="round"
                        icon={<PlusOutlined />}
                        loading={loading}
                      >
                        Add Student
                      </Button>
                    </>
                  )}
                  pagination={{ pageSize: 50 }}
                  columns={tableColumns(() => {
                    setStudentsUpdated(!studentsUpdated);
                  })}
                  dataSource={students}
                  scroll={{ y: 500 }}
                ></Table>
              )}
            </>
          </Content>
          <Footer style={{ textAlign: "center" }}>
            Powered by Ant Design ©2018
          </Footer>
        </Layout>
      </Layout>
      <NewStudentForm
        showAddStudentDrawer={showAddStudentDrawer}
        onClose={() => setShowAddStudentDrawer(false)}
        onSuccessfulAdd={(student: INewStudentFormData) => {
          openNotificationWithIcon(
            NotificationType.SUCCESS,
            "Add success",
            `New Student ${student.firstname}, ${student.lastname} added succesfully!`
          );
          setStudentsUpdated(!studentsUpdated);
          setShowAddStudentDrawer(false);
        }}
        handleSubmit={(formData: INewStudentFormData) => {
          return addStudent(formData);
        }}
        onError={(error: Error) => {
          openNotificationWithIcon(
            NotificationType.ERROR,
            "Add failed",
            error.message
          );
        }}
      />
    </div>
  );
}

export default App;
