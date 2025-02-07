import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Todo, Priority, TodoHistory } from "../types";
import { format } from "date-fns";

interface TodoState {
  todos: Todo[];
  history: TodoHistory[];
  searchQuery: string;
}

const initialState: TodoState = {
  todos: JSON.parse(localStorage.getItem("todos") || "[]"),
  history: JSON.parse(localStorage.getItem("history") || "[]"),
  searchQuery: "",
};

const saveToLocalStorage = (state: TodoState) => {
  localStorage.setItem("todos", JSON.stringify(state.todos));
  localStorage.setItem("history", JSON.stringify(state.history));
};

const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    addTodo: (
      state,
      action: PayloadAction<{ newTodo: string; priority: Priority }>
    ) => {
      const timeStamp = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      const getNewTodo: Todo = {
        id: Date.now().toString(),
        text: action.payload.newTodo,
        completed: false,
        priority: action.payload.priority,
        createdAt: timeStamp,
      };
      state.todos.push(getNewTodo);
      state.history.push({
        action: "Added",
        timeStamp,
        todo: { ...getNewTodo },
      });
      saveToLocalStorage(state);
    },
    updateTodo: (
      state,
      action: PayloadAction<{
        id: string;
        updatedTodo: string;
        priority: Priority;
      }>
    ) => {
      const timeStamp = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      // used find function method
      const getUpdatedTodo = state.todos.find(
        todo => todo.id === action.payload.id
      );
      if (getUpdatedTodo) {
        const oldTodo = { ...getUpdatedTodo };
        getUpdatedTodo.text = action.payload.updatedTodo;
        getUpdatedTodo.priority = action.payload.priority;
        getUpdatedTodo.updatedAt = timeStamp;

        state.history.push({
          action: "Updated",
          timeStamp,
          previousTodo: oldTodo,
          todo: { ...getUpdatedTodo },
        });
      }
      saveToLocalStorage(state);
    },
    toggleCompleteTodo: (state, action: PayloadAction<string>) => {
      const timeStamp = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      // used ternary operation for marking complete task.
      state.todos = state.todos.map(todo =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );
      const toggledTodo = state.todos.find(todo => todo.id === action.payload);
      if (toggledTodo) {
        state.history.push({
          action: "Toggled Completion",
          timeStamp,
          todo: { ...toggledTodo },
        });
      }
      saveToLocalStorage(state);
    },

    removeTodo: (state, action: PayloadAction<string>) => {
      const timeStamp = format(new Date(), "yyyy-MM-dd HH:mm:ss");
      const removedTodo = state.todos.find(todo => todo.id === action.payload);
      if (removedTodo) {
        state.history.push({
          action: "Removed",
          timeStamp,
          todo: { ...removedTodo },
        });
        state.todos = state.todos.filter(todo => todo.id !== action.payload);
        saveToLocalStorage(state);
      }
    },

    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },

    resetHistory: state => {
      state.history = [];
      saveToLocalStorage(state);
    },
  },
});

export const {
  addTodo,
  removeTodo,
  updateTodo,
  toggleCompleteTodo,
  setSearchQuery,
  resetHistory,
} = todoSlice.actions;

export default todoSlice.reducer;
