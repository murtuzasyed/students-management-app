import {
  createSlice,
  createAsyncThunk,
  isAnyOf,
  PayloadAction,
} from "@reduxjs/toolkit";
import StudentDataService, { Student } from "../services/StudentService";
import { RootState } from "../app/store";
interface StudentError {
  isError: boolean;
  message: string;
}
interface StudentState {
  students: Array<Student>;
  isLoading: boolean;
  error: StudentError;
}
const initialState: StudentState = {
  students: new Array(),
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
  async (id: number, { rejectWithValue }) => {
    try {
      await StudentDataService.remove(id);
      return { id };
    } catch (err: any) {
      return rejectWithValue(err?.response?.data);
    }
  }
);

export const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createStudent.fulfilled, (state, { payload }) => {
        state.students.push(payload);
      })
      .addCase(retrieveStudents.fulfilled, (state, { payload }) => {
        state.students = payload;
      })
      .addCase(deleteStudent.fulfilled, (state, { payload }) => {
        const deletedIndex = state.students.findIndex(
          (student: Student) => student.id === payload.id
        );
        state.students.splice(deletedIndex, 1);
      })
      .addCase(updateStudent.fulfilled, (state, { payload }) => {
        const editIndex = state.students.findIndex(
          (student: Student) => student.id === payload.id
        );
        state.students[editIndex] = {
          ...state.students[editIndex],
          ...payload,
        };
      })
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
        (state) => {
          state.isLoading = false;
        }
      )
      .addMatcher(
        isAnyOf(
          createStudent.rejected,
          retrieveStudents.rejected,
          updateStudent.rejected,
          deleteStudent.rejected
        ),
        (state, { payload }: { payload: any }) => {
          state.isLoading = false;
          state.error.isError = true;
          state.error.message = payload.message;
        }
      );
  },
});
export const selectStudent = (state: RootState) => state.student;
export const selectError = (state: RootState) => state.student.error;
export default studentSlice.reducer;
