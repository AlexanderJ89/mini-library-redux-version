import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit";

// Asynkron thunk för att skapa en order
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async ({ items, orderData }, { getState, rejectWithValue }) => {
    const apiKey = getState().apiKey.apiKey;
    const tenantId = orderData.id;
    console.log("Sending order:", orderData);

    if (!apiKey) {
      return rejectWithValue('API-nyckeln saknas!');
    }

    try {
      // Skapa ordern med hjälp av tenantID och Api-key via Post. Skickar sedan Array med items
      const response = await fetch(`https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/${tenantId}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-zocom': apiKey,
        },
        body: JSON.stringify({
          items: items
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        return rejectWithValue(`Kunde inte skapa beställning: ${errorData.message || 'Okänt fel'}`);
      }

      // Hämtar svar
      const initialData = await response.json();
      console.log("Initial order response:", initialData);
      
      // Kollar om det finns nästlad orderstruktur och extraherar orderdata för validering
      const orderObj = initialData.order || initialData;
      
      // Ser om vi fick tillbaka ett order-ID
      if (!orderObj.id) {
        console.error("Order created but no ID returned");
        return rejectWithValue("Kunde inte skapa beställning: Inget order-ID returnerades");
      }
      
      // Hämtar fullständig orderinfo med GET /{tenant}/orders/{id}
      try {
        console.log(`Fetching complete order details for ID: ${orderObj.id}`);
        const detailsResponse = await fetch(`https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/${tenantId}/orders/${orderObj.id}`, {
          headers: {
            'x-zocom': apiKey
          }
        });
        
        if (!detailsResponse.ok) {
          console.warn(`Failed to fetch order details: ${detailsResponse.status}`);
          // Fortsätt med initialData om det inte funkar att hämta detaljer
          return initialData;
        }
        
        const detailedOrder = await detailsResponse.json();
        console.log("Detailed order response:", detailedOrder);
        
        // Kollar så vi fick all information
        const detailedOrderObj = detailedOrder.order || detailedOrder;
        const missingFields = [];
        if (!detailedOrderObj.eta) missingFields.push('eta');
        if (!detailedOrderObj.timestamp) missingFields.push('timestamp');
        if (!detailedOrderObj.state) missingFields.push('state');
        
        if (missingFields.length > 0) {
          console.warn(`Order details missing fields: ${missingFields.join(', ')}`);
        }
        
        // Skickar tillbaka detaljerad information om möjligt
        return detailedOrder; 
      } catch (detailsError) {
        console.error("Error fetching order details:", detailsError);
        return initialData; // Returnera initialData om något går fel med det andra anropet
      }
      
    } catch (error) {
      console.error('Fel vid beställning:', error);
      return rejectWithValue(error.message || 'Ett okänt fel inträffade');
    }
  }
);

// Reducer för att lägga till objekt i varukorgen
export const addToCart = createAction('order/addToCart');
export const removeFromCart = createAction('order/removeFromCart');

const initialState = {
  cart: [],
  cartCount: 0, // koll på antal varor
  orders: [],
  status: 'idle',
  error: null,
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
      state.status = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToCart, (state, action) => {
        // Kontrollera om varan redan finns i varukorgen
        const existingItemIndex = state.cart.findIndex(item => item.id === action.payload.id);
        
        if (existingItemIndex >= 0) {
          // Om varan redan finns, öka count
          if (!state.cart[existingItemIndex].count) {
            state.cart[existingItemIndex].count = 1; // Sätt count till 1 om den inte finns
          }
          state.cart[existingItemIndex].count++;
        } else {
          // Om varan inte finns, lägg till den med count = 1
          const newItem = { ...action.payload, count: 1 };
          state.cart.push(newItem);
        }
        
        state.cartCount = state.cart.reduce((total, item) => total + (item.count || 1), 0);
      })
      .addCase(removeFromCart, (state, action) => {
        const id = action.payload;
        
        // Hitta varan i varukorgen
        const existingItemIndex = state.cart.findIndex(item => item.id === id);
        
        if (existingItemIndex >= 0) {
          const item = state.cart[existingItemIndex];
          
          if (!item.count || item.count <= 1) {
            // Ta bort hela varan om count är 1 eller mindre
            state.cart = state.cart.filter(item => item.id !== id);
          } else {
            // Minska count med 1 om count är större än 1
            state.cart[existingItemIndex].count--;
          }
        }
        
        // Uppdaterar cartCount
        state.cartCount = state.cart.reduce((total, item) => total + (item.count || 1), 0);
      })
      .addCase(createOrder.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders.push(action.payload);
        state.cart = [];
        state.cartCount = 0;
        console.log("Order saved to Redux store:", action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || action.error.message;
        console.error("Order creation failed:", state.error);
      });
  },
});

export const { clearOrderError } = orderSlice.actions;
export default orderSlice.reducer;


