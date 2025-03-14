import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './redux/store.js'

//Min App importeras och ligger wrappad i en Provider som tar emot store som prop för att kunna användas i hela appen

createRoot(document.getElementById('root')).render(

    <Provider store={store}>
      <App />
    </Provider>

)
