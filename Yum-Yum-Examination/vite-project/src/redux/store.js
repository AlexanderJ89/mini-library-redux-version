import { configureStore } from "@reduxjs/toolkit"
import apiKeyReducer from './apiKeySlice'
import menuReducer from './menuSlice'
import tenantReducer from './tenantSlice'
import orderReducer from './orderSlice'
import receiptReducer from './receiptSlice'

//Importerar alla reducers från slice-filerna och sätts ihop till en global store
//Store skickas sedan som prop till Provider i min Main och kan användas i hela appen

const store = configureStore({
    reducer: {
        apiKey: apiKeyReducer,
        menu: menuReducer,
        tenant: tenantReducer,
        order: orderReducer,
        receipt: receiptReducer,
    },
})

export default store