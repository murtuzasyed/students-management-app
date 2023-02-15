import { INewStudentFormData } from "./NewStudentForm";
const checkStatus = async (response: Response) => {
  if (!response.ok) {
    const errorBody = await response.json();
    const error = new Error(errorBody.error);
    error.message = `${errorBody.message} [statusCode:${response.status}]`;
    throw error;
  }
};

export async function getStudents() {
  try {
    const response = await fetch("api/v1/students");
    await checkStatus(response);
    const data = response.json();
    return data;
  } catch (err) {
    throw err;
  }
}

export async function deleteStudent(studentId: number) {
  try {
    const response = await fetch(`api/v1/students/${studentId}`, {
      method: "DELETE",
    });
    await checkStatus(response);
  } catch (err) {
    throw err;
  }
}

export async function addStudent(payload: INewStudentFormData) {
  try {
    const response = await fetch("api/v1/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    await checkStatus(response);
    return payload;
  } catch (err) {
    throw err;
  }
}
