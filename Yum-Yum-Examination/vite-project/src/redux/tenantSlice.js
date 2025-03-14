import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Asynkron Thunk för att skapa en tenant(restaurang/ägare)
export const createTenant = createAsyncThunk(
  'tenant/createTenant',
  async (tenantName, { getState, dispatch, rejectWithValue }) => {
    const apiKey = getState().apiKey.apiKey;

    if (!apiKey) {
      return rejectWithValue('API-nyckeln saknas!');
    }

    const headers = {
      'Content-Type': 'application/json',
      'x-zocom': apiKey,
    };

    try {
      const response = await fetch("https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/tenants", {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ name: tenantName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue('Kunde inte skapa tenant: ' + (errorData.message || 'Okänt fel'));
      }

      const data = await response.json();
      return data; 
    } catch (error) {
      return rejectWithValue('Nätverksfel eller okänt fel');
    }
  }
);

// Thunk för att automatiskt skapa en tenant om det behövs
export const initializeTenant = createAsyncThunk(
  'tenant/initializeTenant',
  async (_, { getState, dispatch }) => {
    const state = getState();
    const tenant = state.tenant.tenant;
    const apiKey = state.apiKey.apiKey;
    
    // Om tenant redan finns så returneras den
    if (tenant) {
      return tenant;
    }
    
    if (!apiKey) {
      throw new Error('API-nyckeln saknas, kan inte skapa tenant');
    }
    
    // Skapar ett slumpmässigt tenant-namn
    const randomName = `tenant_${Math.random().toString(36).substring(2, 10)}`;
    
    // Anropar createTenant och skickar tillbaka resultatet
    const result = await dispatch(createTenant(randomName));
    
    // Om createTenant lyckas returneras den med en payload
    if (createTenant.fulfilled.match(result)) {
      return result.payload;
    } else {
      throw new Error(result.error?.message || 'Kunde inte skapa tenant');
    }
  }
);

const initialState = {
  tenant: null,
  status: 'idle',
  error: null,
};

const tenantSlice = createSlice({
  name: 'tenant',
  initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(createTenant.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createTenant.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tenant = action.payload; // Skapar tenanten och lagrar i state
      })
      .addCase(createTenant.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
      })
      // Hanterar min initializeTenant-thunk
      .addCase(initializeTenant.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(initializeTenant.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tenant = action.payload;
      })
      .addCase(initializeTenant.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default tenantSlice.reducer;



