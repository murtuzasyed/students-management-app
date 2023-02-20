import React, { useEffect, useState } from "react";
import {Avatar, Badge, Button, Spin, Table, Tag, theme} from "antd";
import DeleteStudent from "./DeleteStudent";
import EditStudent from "./EditStudent";
import {addStudent, deleteStudent, getStudents} from "../api";
import openNotificationWithIcon, {NotificationType} from "./Notification";
import {PlusOutlined} from "@ant-design/icons";
import NewStudentForm, {INewStudentFormData} from "./NewStudentForm";
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
const tableColumns = (onStudentsUpdated: () => void, onEdit: (student: INewStudentFormData) => void) => [
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
        render: (text: string, {id, ...student}: StudentData) => (
            <div className="modify-actions">
                <EditStudent onEdit={() => {
                    onEdit(student);
                    }
                } />
            <DeleteStudent
                onDelete={() => {
                    deleteStudent(id)
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
            </div>
        ),
    },
];

function StudentList() {
    const [students, setStudents] = useState<StudentData[]>([]);
    const [loading, setLoading] = useState(false);
    const [showAddStudentDrawer, setShowAddStudentDrawer] = useState(false);
    const [studentsUpdated, setStudentsUpdated] = useState(false);
    const [initialFormValues, setInitialFormValues] = useState<INewStudentFormData | null>(null);
    const {
        token: { colorBgContainer },
    } = theme.useToken();

    useEffect(() => {
        setLoading(true);

        getStudents()
            .then((data: [StudentData]) => {
                setStudents(data);
            })
            .catch((error: Error) => {
                openNotificationWithIcon(
                    NotificationType.ERROR,
                    "Error Loading Students",
                    error.message
                );
            })
            .finally(() => setLoading(false));
    }, [studentsUpdated]);
    return (
        <div className="student-list">
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
                                                    setInitialFormValues(null)
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
                                    }, (student) => {
                                        setInitialFormValues(student)
                                        setShowAddStudentDrawer(true);

                                    })}
                                    dataSource={students}
                                    scroll={{ y: 500 }}
                                ></Table>
                            )}
                        </>
            <NewStudentForm
                initialValues={initialFormValues}
                showAddStudentDrawer={showAddStudentDrawer}
                onClose={() => {
                    setShowAddStudentDrawer(false)
                }}
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
export default StudentList;