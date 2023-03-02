import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  todos: [],
  loading: false,
  error: null,
};

export const fetchTodos = createAsyncThunk(
  "fetch/todos",
  async (_, thunkAPI) => {
    try {
      const res = await fetch("http://localhost:4500/todos");
      const todos = await res.json();

      return todos;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addTodos = createAsyncThunk(
  "add/todos",
  async (data, thunkAPI) => {
    try {
      const res = await fetch("http://localhost:4500/todos", {
        method: "POST",
        body: JSON.stringify({
          text: data,
        }),
        headers: { "Content-type": "application/json" },
      });
      const addTodo = await res.json();

      return addTodo;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteTodos = createAsyncThunk(
  "delete/todos",
  async (id, thunkAPI) => {
    try {
      const res = await fetch(`http://localhost:4500/todos/${id}`, {
        method: "DELETE",
      });
      const deleteTodos = await res.json();
      return deleteTodos;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const patchTodos = createAsyncThunk(
  "patch/todos",
  async ({ id, complated }, thunkAPI) => {
    try {
      const res = await fetch(`http://localhost:4500/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          complated: complated,
        }),
      });
      const patchTodos = await res.json();
      return thunkAPI.fulfillWithValue(patchTodos);
    } catch (error) {}
  }
);

export const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodos.fulfilled, (state, action) => {
        state.todos = action.payload;
        state.loading = false;
      })
      .addCase(fetchTodos.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addTodos.fulfilled, (state, action) => {
        state.todos.push(action.payload);
        state.loading = false;
      })
      .addCase(addTodos.pending, (state) => {
        state.loading = false;
      })
      .addCase(addTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTodos.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTodos.fulfilled, (state, action) => {
        state.loading = false;
        state.todos = state.todos.filter(
          (item) => item._id !== action.payload._id
        );
      })
      .addCase(patchTodos.pending, (state) => {
        state.loading = false
      })
      .addCase(patchTodos.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(patchTodos.fulfilled, (state, action) => {
        state.loading = false
        state.todos = state.todos.map((item) => {
            if(item._id === action.payload._id){
                item = action.payload
            }
            return item
        })
      })
  },
});

export default todoSlice.reducer;
