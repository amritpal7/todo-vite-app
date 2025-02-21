import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { Todo, Priority, TodoHistory } from "../types";
import { toast } from "../hooks/use-toast";
import supabase from "../utils/supabase";
import { v4 as uuidv4 } from "uuid";
import { parseISO, format } from "date-fns";
import { useDispatch } from "react-redux";

interface TodoState {
  todos: Todo[];
  history: TodoHistory[];
  searchQuery: string;
}

const initialState: TodoState = {
  todos: [],
  history: [],
  searchQuery: "",
};

export const fetchTodos = createAsyncThunk("todos/fetchTodos", async () => {
  const { data, error } = await supabase.from("todos").select("*");
  if (error) {
    throw error;
  }
  return data;
});

export const addTodo = createAsyncThunk(
  "todos/addTodo",
  async (
    { newTodo, priority }: { newTodo: string; priority: Priority },
    { dispatch }
  ) => {
    // const timeStamp = format(new Date(), "yyyy-MM-dd HH:mm:ss");
    const todo: Todo = {
      id: uuidv4(),
      text: newTodo,
      completed: false,
      priority,
      created_at: new Date().toISOString(),
    };
    // console.log(todo);
    const { error } = await supabase.from("todos").insert([todo]);
    if (error) throw error;

    await supabase.from("todo_history").insert([
      {
        todo_id: todo.id,
        action: "added",
        previous_text: newTodo,
        previous_priority: priority,
        timeStamp: new Date().toISOString(),
      },
    ]);

    dispatch(fetchHistory());

    return todo;
  }
);

export const toggleCompleteTodo = createAsyncThunk(
  "todos/toggleCompleteTodo",
  async (id: string, { dispatch }) => {
    const { data } = await supabase
      .from("todos")
      .select("completed, text")
      .eq("id", id)
      .single();
    if (!data) throw new Error("Todo not found");

    const completedStatus = !data.completed;

    const { error } = await supabase
      .from("todos")
      .update({ completed: completedStatus })
      .eq("id", id);
    if (error) throw error;

    await supabase.from("todo_history").insert([
      {
        todo_id: id,
        action: completedStatus ? "completed" : "marked uncomplete",
        previous_text: data.text,
        timeStamp: new Date().toISOString(),
      },
    ]);

    dispatch(fetchHistory());

    return { id, completed: completedStatus };
  }
);

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async (
    {
      id,
      updatedTodo,
      priority,
    }: {
      id: string;
      updatedTodo: string;
      priority: Priority;
    },
    { rejectWithValue, dispatch }
  ) => {
    try {
      const { data: existingTodos, error: fetchError } = await supabase
        .from("todos")
        .select("text, priority")
        .eq("id", id)
        .single();
      if (fetchError) throw fetchError;

      const { text: previous_text, priority: previous_priority } =
        existingTodos;

      const timeStamp = new Date().toISOString();
      const { error } = await supabase
        .from("todos")
        .update({ text: updatedTodo, priority, updated_at: timeStamp })
        .eq("id", id)
        .select();

      if (error) throw error;

      await supabase.from("todo_history").insert([
        {
          todo_id: id,
          action: "updated",
          previous_text,
          new_text: updatedTodo,
          previous_priority,
          new_priority: priority,
          timeStamp: timeStamp,
        },
      ]);

      dispatch(fetchHistory());

      return { id, updatedTodo, priority, updatedAt: timeStamp };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const removeTodo = createAsyncThunk(
  "todos/removeTodo",
  async (id: string, { dispatch }) => {
    const { data } = await supabase
      .from("todos")
      .select("text, priority")
      .eq("id", id)
      .single();
    if (!data) throw new Error("Todo  not found!");

    // Log history before deleting
    await supabase.from("todo_history").insert([
      {
        todo_id: id,
        action: "deleted",
        previous_text: data.text,
        previous_priority: data.priority,
        timeStamp: new Date().toISOString(),
      },
    ]);

    // Now delete the todo
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (error) throw error;

    dispatch(fetchHistory());

    return id;
  }
);

export const fetchHistory = createAsyncThunk("todos/fetchHistory", async () => {
  const { data, error } = await supabase.from("todo_history").select("*");
  if (error) {
    throw error;
  }
  return data.map(entry => {
    const { timeStamp, created_at, ...rest } = entry;
    return {
      ...rest,
      timeStamp: format(parseISO(timeStamp), "yyyy-MM-dd HH:mm:ss"),
      created_at: format(parseISO(created_at), "yyyy-MM-dd HH:mm:ss"),
    };
  });
});

export const resetHistory = createAsyncThunk(
  "todos/resetHistory",
  async (_, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("todo_history")
        .delete()
        .gt("id", 0);
      console.log("Delete response: ", data, "Error:", error);
      if (error) throw error;

      return [];
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const todoSlice = createSlice({
  name: "todos",
  initialState,
  extraReducers: builder => {
    builder
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.todos = action.payload;
      })
      .addCase(addTodo.fulfilled, (state, action) => {
        state.todos.push(action.payload);
        toast({
          title: "Added:",
          description: `todo added successfully.`,
        });
      })
      .addCase(toggleCompleteTodo.fulfilled, (state, action) => {
        const toggledTodo = state.todos.find(
          todo => todo.id === action.payload.id
        );
        if (toggledTodo) {
          toggledTodo.completed = action.payload.completed;
        }
        toast({
          title: "Toggled:",
          description: `todo ${toggledTodo?.text} has been toggled.`,
        });
      })
      .addCase(removeTodo.fulfilled, (state, action) => {
        const removedTodo = state.todos.find(
          todo => todo.id === action.payload
        );
        if (removedTodo) {
          state.todos = state.todos.filter(todo => todo.id !== action.payload);
          toast({
            title: "Deleted",
            description: `todo ${removedTodo.text} has been deleted`,
            variant: "destructive",
          });
        }
      })
      .addCase(updateTodo.fulfilled, (state, action) => {
        const updatedTodo = state.todos.find(
          todo => todo.id === action.payload.id
        );
        if (updatedTodo) {
          updatedTodo.text = action.payload.updatedTodo;
          updatedTodo.priority = action.payload.priority;
          updatedTodo.updatedAt = action.payload.updatedAt;
        }
        toast({
          title: "Updated:",
          description: `Todo '${action.payload.updatedTodo}' has been updated.`,
        });
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      })
      .addCase(resetHistory.fulfilled, state => {
        state.history = [];
        toast({
          title: "Deleted!",
          description: "All history has been deleted successfully.",
          variant: "destructive",
        });
      });
  },
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
});

export const { setSearchQuery } = todoSlice.actions;

export default todoSlice.reducer;
