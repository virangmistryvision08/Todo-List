import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "../components/todo/TodoSlice";

export const store = configureStore({
    reducer:{
        todo: todoReducer,
    }
})