
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MenuPage from './pages/menuPage/menuPage'
import OrderPage from './pages/OrderPage/OrderPage'
import EtaPage from './pages/EtaPage/EtaPage'
import ReceiptPage from './pages/ReceiptPage/ReceiptPage'

const Routing = () => {
  return (
    <div>
        <Routes>
            <Route path='/' element={<MenuPage />} />
            <Route path='/order' element={<OrderPage />} />
            <Route path='/eta' element={<EtaPage />} />
            <Route path='/receipt' element={<ReceiptPage />} />
        </Routes>
    </div>
  )
}

export default Routing
