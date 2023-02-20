import { configureStore } from "@reduxjs/toolkit";
import studentsReducer from './slices/students';
export const store = configureStore({
    reducer: {
        students: studentsReducer
    },
    devTools: true,
})

export default store;
