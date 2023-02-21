import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { Avatar, Badge, Button, Spin, Table, Tag } from "antd";
import DeleteStudent from "./DeleteStudent";
import EditStudent from "./EditStudent";
// import { addStudent, deleteStudent } from "../api";
import {
  retrieveStudents,
  deleteStudent,
  selectStudent,
} from "../slices/student";
import openNotificationWithIcon, { NotificationType } from "./Notification";
import { PlusOutlined } from "@ant-design/icons";
import NewStudentForm, { INewStudentFormData } from "./NewStudentForm";
import { useAppDispatch, useAppSelector } from "../app/hook";
export enum Gender {
  Male = "MALE",
  Female = "FEMALE",
}

export type StudentData = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  gender: Gender;
};
const tableColumns = (
  onEdit: (student: StudentData) => void,
  onDelete: (student: StudentData) => void
) => [
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
      <div className="modify-actions">
        <EditStudent
          onEdit={() => {
            onEdit(student);
          }}
        />
        <DeleteStudent onDelete={() => onDelete(student)} />
      </div>
    ),
  },
];

function StudentList() {
  const { isLoading, students } = useAppSelector(selectStudent);
  const dispatch = useAppDispatch();
  const [showAddStudentDrawer, setShowAddStudentDrawer] = useState(false);
  const [initialFormValues, setInitialFormValues] =
    useState<StudentData | null>(null);
  const initFetch = useCallback(() => {
    dispatch(retrieveStudents());
  }, [dispatch]);
  useEffect(() => {
    debugger;
    initFetch();
  }, [initFetch]);
  return (
    <div className="student-list">
      {isLoading && <Spin />}
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
                  setInitialFormValues(null);
                  setShowAddStudentDrawer(true);
                }}
                shape="round"
                icon={<PlusOutlined />}
                loading={isLoading}
              >
                Add Student
              </Button>
            </>
          )}
          pagination={{ pageSize: 50 }}
          columns={tableColumns(
            (student) => {
              setInitialFormValues(student);
              setShowAddStudentDrawer(true);
            },
            (student) => {
              dispatch(deleteStudent(student.id))
                .then(() => {
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
            }
          )}
          dataSource={students}
          scroll={{ y: 500 }}
        ></Table>
      )}
      <NewStudentForm
        initialValues={initialFormValues}
        showAddStudentDrawer={showAddStudentDrawer}
        onClose={() => {
          setShowAddStudentDrawer(false);
        }}
        onSuccessfulAdd={(student: INewStudentFormData) => {
          openNotificationWithIcon(
            NotificationType.SUCCESS,
            "Add success",
            `New Student ${student.firstname}, ${student.lastname} added succesfully!`
          );
          setShowAddStudentDrawer(false);
        }}
        onSuccessfulEdit={(student: INewStudentFormData) => {
          openNotificationWithIcon(
            NotificationType.SUCCESS,
            "Edit success",
            `Student ${student.firstname}, ${student.lastname}  was edited added succesfully!`
          );
          setShowAddStudentDrawer(false);
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
export default StudentList;
