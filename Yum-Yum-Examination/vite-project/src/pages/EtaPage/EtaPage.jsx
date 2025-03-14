import React, { useState, useEffect } from 'react';
import './EtaPage.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import sushiBox from '../../assets/sushi-box.png';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button';

const EtaPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  // Hämta orderData från min Store
  const orders = useSelector((state) => state.order.orders);
  const orderStatus = useSelector((state) => state.order.status);
  
  // Få tillgång till orderdata. Hantera både nästlad och icke-nästlad struktur
  const getOrderData = () => {
    if (!orders || orders.length === 0) return null;
    const latestOrder = orders[orders.length - 1];
    return latestOrder.order || latestOrder;
  };
  
  const orderData = getOrderData();
  
  // Hantera laddningstillstånd och logga orderdata när det ändras
  useEffect(() => {
    if (orderStatus === 'succeeded' || orderStatus === 'failed') {
      setIsLoading(false);
    }
    
    if (orderData) {
      console.log("Order data extracted:", orderData);
    }
  }, [orderData, orderStatus]);
  
  const handleNewOrder = () => {
    navigate('/');
  };

  const handleViewReceipt = () => {
    navigate('/receipt');
  };

  // Beräkna tid för ETA i minuter från nu utifrån Api-svar
  const calculateEtaMinutes = () => {
    if (!orderData || !orderData.eta) {
      return "...";
    }
    
    try {
      const etaDate = new Date(orderData.eta);
      const now = new Date();
      const diffMs = etaDate - now;
      const diffMinutes = Math.round(diffMs / 60000);
      return diffMinutes > 0 ? diffMinutes : "< 1";
    } catch (error) {
      return "?";
    }
  };

  // Visa order-ID från Api
  const getOrderId = () => {
    if (!orderData || !orderData.id) {
      return "...";
    }
    return orderData.id;
  };

  // Visa laddning om det fortfarande laddar eller om orderData inte finns än
  if (isLoading || !orderData) {
    return (
      <div className="eta-page">
        <Header showCart={false} logoOnly={true} />
        
        <div className="content">
          <div className="food-image-container">
            <img 
              src={sushiBox} 
              alt="Sushi-box" 
              className="sushi" 
            />
          </div>
          
          <h1 className="title">LADDAR<br />BESTÄLLNING...</h1>
          
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="eta-page">
      <Header showCart={false} logoOnly={true} />
      
      <div className="content">
        <div className="food-image-container">
          <img 
            src={sushiBox} 
            alt="Sushi-box" 
            className="sushi" 
          />
        </div>
        
        <h1 className="title">DINA WONTONS<br />TILLAGAS!</h1>
        
        <div className="eta-info">
          <p className="eta-time">ETA {calculateEtaMinutes()} MIN</p>
          <p className="order-id">#{getOrderId()}</p>
        </div>
        
        <div className="button-container">
          <Button 
            text="GÖR EN NY BESTÄLLNING" 
            onClick={handleNewOrder}
          />
          
          <Button 
            text="SE KVITTO" 
            onClick={handleViewReceipt} 
            styleClass="button-gray"
          />
        </div>
      </div>
    </div>
  );
};

export default EtaPage;




