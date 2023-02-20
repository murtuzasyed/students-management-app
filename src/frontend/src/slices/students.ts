import { createSlice, createAsyncThunk, isAnyOf } from "@reduxjs/toolkit";
import StudentDataService, { Student } from "../services/student.service";

interface StudentError {
  isError: boolean;
  message: string;
}
interface StudentState {
  students: [];
  isLoading: boolean;
  error: StudentError;
}
const initialState: StudentState = {
  students: [],
  isLoading: false,
  error: {
    isError: false,
    message: "",
  },
};

export const createStudent = createAsyncThunk(
  "students/create",
  async (student: Omit<Student, "id">, { rejectWithValue }) => {
    try {
      const res = await StudentDataService.create(student);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  }
);
export const retrieveStudents = createAsyncThunk(
  "students/retrieve",
  async (_, { rejectWithValue }) => {
    const res = await StudentDataService.getAll();
    return res.data;
  }
);

export const updateStudent = createAsyncThunk(
  "students/update",
  async (
    { id, data }: { id: number; data: Omit<Student, "id"> },
    { rejectWithValue }
  ) => {
    try {
      const res = await StudentDataService.update(id, data);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  }
);

export const deleteStudent = createAsyncThunk(
  "students/delete",
  async ({ id }: { id: number }, { rejectWithValue }) => {
    try {
      const res = await StudentDataService.delete(id);
      return res.data;
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  }
);

export const studentSlice = createSlice({
  name: "students",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        isAnyOf(
          createStudent.pending,
          retrieveStudents.pending,
          updateStudent.pending,
          deleteStudent.pending
        ),
        (state, action) => {
          state.isLoading = true;
        }
      )
      .addMatcher(
        isAnyOf(
          createStudent.fulfilled,
          retrieveStudents.fulfilled,
          updateStudent.fulfilled,
          deleteStudent.fulfilled
        ),
        (state, action) => {
          state.isLoading = false;
          state.students = action.payload;
        }
      )
      .addMatcher(
        isAnyOf(
          createStudent.rejected,
          retrieveStudents.rejected,
          updateStudent.rejected,
          deleteStudent.rejected
        ),
        (state, { payload }) => {
          state.isLoading = false;
          state.students = [];
          state.error.isError = true;
          state.error.message = typeof payload === 'string' ? payload : '';
        }
      );
  },
});
export const selectStudents = (state: StudentState) => state.students;
export const selectError = (state: StudentState) => state.error;
export default studentSlice.reducer;