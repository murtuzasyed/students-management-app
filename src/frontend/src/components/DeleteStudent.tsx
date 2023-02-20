import React, { useState } from "react";
import { Button, Popconfirm } from "antd";

type DeleteStudentProps = {
  onDelete: () => void;
};
const DeleteStudent = ({ onDelete }: DeleteStudentProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <Popconfirm
        title="Delete Student"
        open={open}
        onConfirm={onDelete}
        onCancel={() => setOpen(false)}
      >
        <Button onClick={() => setOpen(true)}>Delete</Button>
      </Popconfirm>
    </div>
  );
};
export default DeleteStudent;
