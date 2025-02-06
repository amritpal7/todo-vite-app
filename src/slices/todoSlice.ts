import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Todo } from "../types";

interface TodoState {
  todos: Todo[];
  searchQuery: string;
}

const initialState: TodoState = {
  todos: [],
  searchQuery: "",
};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<string>) => {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: action.payload,
        completed: false,
      };
      state.todos.push(newTodo);
    },
    editTodo: (
      state,
      action: PayloadAction<{ id: string; updatedTodo: string }>
    ) => {
      // used find function method
      const getUpdatedTodo = state.todos.find(
        todo => todo.id === action.payload.id
      );
      if (getUpdatedTodo) {
        getUpdatedTodo.text = action.payload.updatedTodo;
      }
    },
    toggleCompleteTodo: (state, action: PayloadAction<string>) => {
      // used ternary operation for marking complete task.
      state.todos = state.todos.map(todo =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );
    },

    removeTodo: (state, action: PayloadAction<string>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  addTodo,
  removeTodo,
  editTodo,
  toggleCompleteTodo,
  setSearchQuery,
} = todoSlice.actions;

export default todoSlice.reducer;
