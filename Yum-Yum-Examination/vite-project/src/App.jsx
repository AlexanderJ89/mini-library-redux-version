import { BrowserRouter } from 'react-router-dom'
import Routing from './Routing'

//BrowserRouter som wrappar hela appen och Routing som innehåller alla routes som finns i egen komponent (Routing)
function App() {

  return (
    <BrowserRouter>
        <Routing />
    </BrowserRouter>
  )
}

export default App
