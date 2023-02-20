import React, { useState } from "react";
import { Button, Popconfirm } from "antd";

type EditStudentProps = {
    onEdit: () => void;
};
const EditStudent = ({ onEdit }: EditStudentProps) => {
    const [open, setOpen] = useState(false);
    return (
        <div className={"edit-button"}>
                <Button onClick={onEdit}>Edit</Button>
        </div>
    );
};
export default EditStudent;
