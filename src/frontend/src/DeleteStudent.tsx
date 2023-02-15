import React, { useState } from "react";
import { Button, Popconfirm } from "antd";

type DeleteStudent = {
  onDelete: () => void;
};
const DeleteStudent = ({ onDelete }: DeleteStudent) => {
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
