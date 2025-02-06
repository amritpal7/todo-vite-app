import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Todo, Priority } from "../types";

interface TodoState {
  todos: Todo[];
  searchQuery: string;
}

const initialState: TodoState = {
  todos: JSON.parse(localStorage.getItem("todos") || "[]"),
  searchQuery: "",
};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (
      state,
      action: PayloadAction<{ newTodo: string; priority: Priority }>
    ) => {
      const getNewTodo: Todo = {
        id: Date.now().toString(),
        text: action.payload.newTodo,
        completed: false,
        priority: action.payload.priority,
        createdAt: new Date().toISOString(),
      };
      state.todos.push(getNewTodo);
      localStorage.setItem("todos", JSON.stringify(state.todos));
    },
    updateTodo: (
      state,
      action: PayloadAction<{
        id: string;
        updatedTodo: string;
        priority: Priority;
      }>
    ) => {
      // used find function method
      const getUpdatedTodo = state.todos.find(
        todo => todo.id === action.payload.id
      );
      if (getUpdatedTodo) {
        getUpdatedTodo.text = action.payload.updatedTodo;
        getUpdatedTodo.priority = action.payload.priority;
      }
      localStorage.setItem("todos", JSON.stringify(state.todos));
    },
    toggleCompleteTodo: (state, action: PayloadAction<string>) => {
      // used ternary operation for marking complete task.
      state.todos = state.todos.map(todo =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );
      localStorage.setItem("todos", JSON.stringify(state.todos));
    },

    removeTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
      localStorage.setItem("todos", JSON.stringify(state.todos));
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  addTodo,
  removeTodo,
  updateTodo,
  toggleCompleteTodo,
  setSearchQuery,
} = todoSlice.actions;

export default todoSlice.reducer;
