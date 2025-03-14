import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchReceipt, clearReceipt } from '../../redux/receiptSlice';
import Header from '../../components/Header/Header';
import Button from '../../components/Button/Button'
import logoRed from '../../assets/logo-red.png'; 
import './ReceiptPage.scss';

const ReceiptPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Hämta data från min Store
  const receiptData = useSelector((state) => state.receipt.receipt);
  const receiptStatus = useSelector((state) => state.receipt.status);
  const receiptError = useSelector((state) => state.receipt.error);
  const orders = useSelector((state) => state.order.orders);
  
  // Extrahera receipt från nästlad struktur
  const receipt = receiptData?.receipt || receiptData;
  
  // Felsökning
  useEffect(() => {
    /* console.log("Receipt data from Redux:", receiptData);
    console.log("Extracted receipt:", receipt); */
  }, [receiptData, receipt]);
  
  // Hämta senaste orderns ID
  useEffect(() => {
    // Rensa tidigare kvitto
    dispatch(clearReceipt());
    
    if (orders && orders.length > 0) {
      const latestOrder = orders[orders.length - 1];
      // Hantera både nästlad och icke-nästlad struktur
      const orderData = latestOrder.order || latestOrder;
      const orderId = orderData.id;
      
      if (orderId) {
        console.log("Fetching receipt for order ID:", orderId);
        dispatch(fetchReceipt(orderId));
      } else {
        console.error("No order ID found");
      }
    } else {
      console.error("No orders found");
    }
  }, [dispatch, orders]);
  
  const handleNewOrder = () => {
    navigate('/');
  };
  
  // Formatera datum
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleString('sv-SE', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };
  
  // Visa laddning
  if (receiptStatus === 'loading') {
    return (
      <div className="receipt-page">
        <Header showCart={false} logoOnly={true} />
        <div className="loading-container">
          <h2>Hämtar kvitto...</h2>
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }
  
  // felmeddelande
  if (receiptStatus === 'failed') {
    return (
      <div className="receipt-page">
        <Header showCart={false} logoOnly={true} />
        <div className="error-container">
          <h2>Kunde inte hämta kvitto</h2>
          <p>{receiptError}</p>
          <Button 
            text="TILLBAKA TILL MENYN"
            onClick={handleNewOrder}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="receipt-page">
      <Header showCart={false} logoOnly={true} />
      
      <div className="receipt-container">
        <div className="receipt-content">
          <div className="receipt-logo">
            <img src={logoRed} alt="Logo" className="logo-red" />
          </div>
          
          <h1 className="receipt-title">KVITTO</h1>
          <p className="receipt-id">#{receipt?.id || ''}</p>
          
          <div className="receipt-items">
            {receipt?.items && receipt.items.length > 0 ? (
              receipt.items.map((item, index) => (
                <div key={index} className="receipt-item">
                  <div className="item-name-container">
                    <h3 className="item-name">{item.name}</h3>
                    <p className="item-quantity">{item.quantity || 1} stycken</p>
                  </div>
                  <div className="item-dots"></div>
                  <p className="item-price">{item.price} SEK</p>
                </div>
              ))
            ) : (
              <div className="receipt-item empty">
                <p>Inga varor</p>
              </div>
            )}
          </div>
          
          <div className="receipt-total">
            <div className="total-container">
              <h3 className="total-label">TOTALT</h3>
              <p className="total-note">inkl 20% moms</p>
            </div>
            <p className="total-amount">{receipt?.orderValue || 0} SEK</p>
          </div>
        </div>
        
        <Button 
          text="GÖR EN NY BESTÄLLNING"
          onClick={handleNewOrder}
        />
      </div>
    </div>
  );
};

export default ReceiptPage;


