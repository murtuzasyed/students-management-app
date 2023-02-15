import React, { useState } from "react";
import { Button, Form, Input, Radio, Drawer } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
  },
};

enum Gender {
  Male = "MALE",
  Female = "FEMALE",
}

export interface INewStudentFormData {
  firstname: "string";
  lastname: "string";
  email: "string";
  gender: Gender;
}
interface INewStudentFormProps {
  handleSubmit: (formData: INewStudentFormData) => Promise<INewStudentFormData>;
  showAddStudentDrawer: boolean;
  onSuccessfulAdd: (student: INewStudentFormData) => void;
  onClose: () => void;
  onError: (error: Error) => void;
}
const NewStudentForm = ({
  handleSubmit,
  showAddStudentDrawer,
  onSuccessfulAdd,
  onClose,
  onError,
}: INewStudentFormProps) => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
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
        onFinish={({ student }) => {
          form.resetFields();
          setSubmitting(true);
          handleSubmit(student)
            .then(() => {
              onSuccessfulAdd(student);
              setSubmitting(false);
            })
            .catch((err) => onError(err))
            .finally(() => setSubmitting(false));
        }}
        validateMessages={validateMessages}
      >
        <Form.Item
          name={["student", "firstname"]}
          label="Firstname"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={["student", "lastname"]}
          label="Lastname"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name={["student", "email"]}
          label="Email"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Gender"
          name={["student", "gender"]}
          rules={[{ required: true }]}
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
        {submitting && <Spin indicator={antIcon} />}
      </Form>
    </Drawer>
  );
};
export default NewStudentForm;
