import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Skapa en asynkron thunk(funktion), getState hämtar info frå Redux i vårt fall apiKey
export const fetchMenu = createAsyncThunk(
  'menu/fetchMenu',
  async (_, { getState }) => {
    const apiKey = getState().apiKey.apiKey;
    if (!apiKey) {
      throw new Error('API-nyckeln saknas!');
    }

    // Fetchanrop endpoint (menu) via metoden GET för att hämta menyn där apikey skickas med i headern
    const response = await fetch("https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu", {
      method: "GET",
      headers: { "x-zocom": apiKey },
    });

    if (!response.ok) {
      throw new Error('API-anropet misslyckades');
    }

    const data = await response.json();
    return data.items; 
  }
);

// State/tillstånd vid start
const initialState = {
  menu: null,
  status: 'idle', 
  error: null,
};

// Skapar vår slice med extra reducers som hanterar om tillstånden och uppdaterar utifrån vårt fetchanrop
const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.menu = action.payload; 
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default menuSlice.reducer;


