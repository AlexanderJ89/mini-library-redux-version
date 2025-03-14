import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Skapar en asynkron thunk som hämtar nyckel med hjälp av POST och returnerar nyckeln
//Nyckeln behövs sen i alla andra API-anrop
export const fetchApiKey = createAsyncThunk('api/fetchApiKey', async () => {
    const response = await fetch("https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/keys", {
        method: 'POST',  
        headers: {
        'Content-Type': 'application/json',  
        },
    });
    
    if (!response.ok) {
        throw new Error('Kunde inte hämta API-nyckeln');
    }
    
    const data = await response.json();
    return data.key;  
    });

// Tillstånd(State) från början för ApiKey
const initialState = {
    apiKey: null,
    status: 'idle', //kan vara loading, succeeded eller failed
    error: null,
}

// Skapar en slice för ApiKey och extrareducers uppdaterar State utifrån status, sedan exporteras apiKeySlice.reducer till Store
const apiKeySlice = createSlice({
    name: 'apiKey',
    initialState, 
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchApiKey.pending, (state) => {
                state.status = 'loading'
            })
            .addCase(fetchApiKey.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.apiKey = action.payload
            })
            .addCase(fetchApiKey.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    }
})

export default apiKeySlice.reducer
















