import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMenu } from '../../redux/menuSlice';
import { fetchApiKey } from '../../redux/apiKeySlice';
import { addToCart } from '../../redux/orderSlice';
import { initializeTenant } from '../../redux/tenantSlice';
import './menuPage.scss';
import Header from '../../components/Header/Header';

const MenuPage = () => {
  const dispatch = useDispatch();
  
  // useSelector hämtar states, data från min Store
  const menu = useSelector((state) => state.menu.menu);
  const status = useSelector((state) => state.menu.status);
  const error = useSelector((state) => state.menu.error);
  const apiKey = useSelector((state) => state.apiKey.apiKey);
  const tenant = useSelector((state) => state.tenant.tenant);
  const tenantStatus = useSelector((state) => state.tenant.status);

  // Hämta ApiKey, Dispatch triggar en action o uppdatering av state
  useEffect(() => {
    if (!apiKey) {
      dispatch(fetchApiKey());
    }
  }, [dispatch, apiKey]);

  // Initialisera tenant när ApiKey har hämtats
  useEffect(() => {
    if (apiKey && !tenant) {
      dispatch(initializeTenant());
    }
  }, [dispatch, apiKey, tenant]);

  // Hämta menyn först när ApiKey och tenant finns
  useEffect(() => {
    if (apiKey && tenant && status === 'idle') {
      dispatch(fetchMenu());
    }
  }, [dispatch, apiKey, tenant, status]);

  // Lägg till i varukorgen
  const handleAddToCart = (item) => {
    dispatch(addToCart(item));
  };

  // Dela upp menyn i grupper utifrån typ
  const groupMenuByType = () => {
    if (!menu || menu.length === 0) return {};
    
    return menu.reduce((groups, item) => {
      const type = item.type || 'other';
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(item);
      return groups;
    }, {});
  };

  const menuByType = groupMenuByType();

  // Laddningsstatus för menyn
  if (status === 'loading' || tenantStatus === 'loading' || !apiKey) {
    return <div className="loading">Laddar meny...</div>;
  }

  if (status === 'failed') {
    return <div className="error">Fel vid hämtning av meny: {error}</div>;
  }

  if (tenantStatus === 'failed') {
    return <div className="error">Fel vid skapande av tenant: {tenant?.error}</div>;
  }

  return (
    <div className="menu-page">
      <Header />
      
      <div className="menu-container">
        <h1 className="menu-title">MENY</h1>
        
        {menuByType.wonton && (
          <div className="menu-section">
            {menuByType.wonton.map((item) => (
              <div key={item.id} className="menu-item" onClick={() => handleAddToCart(item)}>
                <div className="menu-item-content">
                  <div className="menu-item-header">
                    <h2 className="menu-item-name">{item.name}</h2>
                    <div className="menu-item-dots"></div>
                    <p className="menu-item-price">{item.price} SEK</p>
                  </div>
                  <p className="menu-item-ingredients">
                    {item.ingredients ? item.ingredients.join(', ') : item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {menuByType.dip && (
          <div className="menu-section">
            <div className="menu-item-header">
                <h2 className="menu-item-name">DIPSÅS</h2>
                <div className="menu-item-dots"></div>
                <p className="menu-item-price">19 SEK</p>
            </div>
            <div className="dips-container">
              {menuByType.dip.map((item) => (
                <div 
                  key={item.id} 
                  className="dip-item" 
                  onClick={() => handleAddToCart(item)}
                >
                  {item.name}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {menuByType.drink && (
          <div className="menu-section">
           <div className="menu-item-header">
                <h2 className="menu-item-name">DRYCK</h2>
                <div className="menu-item-dots"></div>
                <p className="menu-item-price">19 SEK</p>
            </div>
            {menuByType.drink.map((item) => (
              <div key={item.id} className="menu-item" onClick={() => handleAddToCart(item)}>
                <div className="menu-item-content">
                  <div className="menu-item-header">
                    <h2 className="menu-item-name">{item.name}</h2>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MenuPage;




