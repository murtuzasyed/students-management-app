import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { Button, Form, Input, Radio, Drawer } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import { Student, Gender } from "../services/StudentService";
import {
  createStudent,
  updateStudent,
  selectStudent,
  selectError,
} from "../slices/student";
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

export type INewStudentFormData = Omit<Student, "id">;
interface INewStudentFormProps {
  showAddStudentDrawer: boolean;
  onSuccessfulAdd: (student: INewStudentFormData) => void;
  onSuccessfulEdit: (student: INewStudentFormData) => void;
  onClose: () => void;
  onError: (error: Error) => void;
  initialValues: Student | null;
}
const NewStudentForm = ({
  // handleSubmit,
  showAddStudentDrawer,
  onSuccessfulAdd,
  onSuccessfulEdit,
  onClose,
  onError,
  initialValues,
}: INewStudentFormProps) => {
  const [form] = Form.useForm();
  const { isLoading } = useAppSelector(selectStudent);
  const dispatch = useAppDispatch();
  useEffect(() => form.resetFields(), [form, initialValues]);

  return (
    <Drawer
      width={720}
      title="New Student Drawer"
      placement="right"
      open={showAddStudentDrawer}
      onClose={onClose}
    >
      <Form
        name="newStudentForm"
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={async ({ student }: { student: Omit<Student, "id"> }) => {
          if (initialValues === null) {
            dispatch(createStudent(student))
              .unwrap()
              .then(() => {
                form.resetFields();
                onSuccessfulAdd(student);
              })
              .catch((err) => onError(err));
          } else {
            dispatch(updateStudent({ id: initialValues.id, data: student }))
              .unwrap()
              .then(() => {
                form.resetFields();
                onSuccessfulEdit(student);
              })
              .catch((err) => onError(err));
          }
        }}
      >
        <Form.Item
          name={["student", "firstname"]}
          label="Firstname"
          rules={[
            { required: true, message: "Please enter student firstname" },
          ]}
          initialValue={initialValues?.firstname}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={["student", "lastname"]}
          label="Lastname"
          rules={[{ required: true, message: "Please enter student lastname" }]}
          initialValue={initialValues?.lastname}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={["student", "email"]}
          label="Email"
          rules={[{ required: true, message: "Please enter student email" }]}
          initialValue={initialValues?.email}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Gender"
          name={["student", "gender"]}
          rules={[{ required: true, message: "Please enter student gender" }]}
          initialValue={initialValues?.gender}
        >
          <Radio.Group>
            <Radio value={Gender.Male}>Male</Radio>
            <Radio value={Gender.Female}>Female</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
        {isLoading && <Spin indicator={antIcon} />}
      </Form>
    </Drawer>
  );
};
export default NewStudentForm;
