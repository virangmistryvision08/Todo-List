import { createSlice } from "@reduxjs/toolkit";

const todoSlice = createSlice({
  name: "todo",
  initialState: {
    todos: [],
    completeTodo: [],
    pendingTodo: [],
  },
  reducers: {
    createTodo: (state, action) => {
      state.todos.push(action.payload);
      state.pendingTodo.push(action.payload);
    },
    deleteTodo: (state, action) => {
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);
      state.pendingTodo = state.pendingTodo.filter((todo) => todo.id !== action.payload);
      state.completeTodo = state.completeTodo.filter(
        (todo) => todo.id !== action.payload
      );
    },
    editTodo: (state, action) => {
      const todo = state.todos.find((todo) => todo.id === action.payload.editId);
      if (todo) {
        todo.todoName = action.payload.editTodoText.todoName;
      }

      state.pendingTodo = state.todos.filter((todo) => !todo.completed);
      state.completeTodo = state.todos.filter((todo) => todo.completed);
    },
    toggleTodo: (state, action) => {
      const todo = state.todos.find(todo => todo.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
      }
      state.completeTodo = state.todos.filter(todo => todo.completed);
      state.pendingTodo = state.todos.filter(todo => !todo.completed);
    }
  },
});

export const { createTodo, deleteTodo, editTodo, toggleTodo } = todoSlice.actions;

export default todoSlice.reducer;
