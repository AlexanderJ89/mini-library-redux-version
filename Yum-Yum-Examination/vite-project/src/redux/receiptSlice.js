import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Thunk för att hämta kvitto
export const fetchReceipt = createAsyncThunk(
  'receipt/fetchReceipt',
  async (orderId, { getState, rejectWithValue }) => {
    const apiKey = getState().apiKey.apiKey;
    
    if (!apiKey) {
      return rejectWithValue('API-nyckeln saknas!');
    }

    try {
      const response = await fetch(`https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/receipts/${orderId}`, {
        headers: {
          'x-zocom': apiKey
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        return rejectWithValue(`Kunde inte hämta kvitto: ${errorData.message || 'Okänt fel'}`);
      }

      const data = await response.json();
      console.log("Receipt response:", data);
      return data;
    } catch (error) {
      console.error('Fel vid hämtning av kvitto:', error);
      return rejectWithValue(error.message || 'Ett okänt fel inträffade');
    }
  }
);

const initialState = {
  receipt: null,
  status: 'idle',
  error: null,
};

const receiptSlice = createSlice({
  name: 'receipt',
  initialState,
  reducers: {
    clearReceipt: (state) => {
      state.receipt = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReceipt.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchReceipt.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.receipt = action.payload;
      })
      .addCase(fetchReceipt.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      });
  },
});

export const { clearReceipt } = receiptSlice.actions;
export default receiptSlice.reducer;
