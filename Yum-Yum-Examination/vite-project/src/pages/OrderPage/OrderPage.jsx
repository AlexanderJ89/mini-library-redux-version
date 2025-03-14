import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createOrder, removeFromCart } from '../../redux/orderSlice';
import Button from '../../components/Button/Button';
import Header from '../../components/Header/Header';
import './OrderPage.scss';
import { useNavigate } from 'react-router-dom';
import binIcon from '../../assets/bin.png';

const OrderPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Hämta data från min Store
  const tenant = useSelector((state) => state.tenant.tenant);
  const tenantStatus = useSelector((state) => state.tenant.status);
  const tenantError = useSelector((state) => state.tenant.error);
  const cartItems = useSelector((state) => state.order.cart);
  const orderStatus = useSelector((state) => state.order.status);

  useEffect(() => {
    if (!tenant && tenantStatus === 'idle') {
      console.log('Tenant saknas');
    }
  }, [tenant, tenantStatus]);

  // Skapa itemsId från cartItems baserat på count
  const itemsId = [];
  cartItems.forEach((item) => {
    const count = item.count || 1;
    for (let i = 0; i < count; i++) {
      itemsId.push(item.id);
    }
  });

  // Räkna ihop totalsumma
  const totalAmount = cartItems.reduce((total, item) => {
    const count = item.count || 1;
    return total + (item.price * count);
  }, 0);

  // Hantera borttagning av vara
  const handleRemoveItem = (item) => {
    dispatch(removeFromCart(item.id));
  };

  // Hantera beställning o skapa orderdata
  const handleOrder = () => {
    if (tenant && cartItems.length > 0 && itemsId.length > 0) {
      
      const newOrder = {
        id: tenant.id,
        items: itemsId,
      };

      // Skicka order till min Store och navigera till Eta om det lyckas
      dispatch(createOrder({ items: itemsId, orderData: newOrder }))
        .unwrap()
        .then(() => {
          navigate('/eta');
        })
        .catch((error) => {
          console.error("Beställningsfel:", error);
        });
    } else {
      console.log("Fel: Tenant saknas, inga varor i varukorgen eller itemsId är tom.");
    }
  };

  // Laddningsindikator medan beställningen skickas
  if (orderStatus === 'loading') {
    return (
      <div className="order-page">
        <Header />
        <div className="order-container">
          <div className="loading-container">
            <h2>Skickar beställning...</h2>
            <div className="loading-spinner"></div>
          </div>
        </div>
      </div>
    );
  }

  // Statusmeddelanden
  if (tenantStatus === 'loading') {
    return <div className="loading">Hämtar tenantdata...</div>;
  }

  if (tenantStatus === 'failed') {
    return <div className="error">Fel vid hämtning av tenant: {tenantError}</div>;
  }

  return (
    <div className="order-page">
      <Header showLogo={false} showCart={true} cartOnly={true} />

      <div className="order-container">
        <div className="order-items-list">
          {cartItems.length > 0 ? (
            cartItems.map((item, index) => (
              <div key={index} className="order-item">
                <img 
                  src={binIcon} 
                  alt="Ta bort" 
                  className="bin-icon" 
                  onClick={() => handleRemoveItem(item)} 
                  title="Ta bort en"
                />
                <div className="item-info">
                  <div className="item-name">{item.name}</div>
                  <div className="item-quantity">Antal: {item.count || 1}</div>
                </div>
                <div className="item-dots"></div>
                <div className="item-price">{item.price * (item.count || 1)} SEK</div>
              </div>
            ))
          ) : (
            <p className="empty-cart">Inga varor i beställningen.</p>
          )}
        </div>
        
        <div className="order-divider"></div>
        
        <div className="order-total">
          <div className="total-label">TOTALT</div>
          <div className="total-amount">{totalAmount} SEK</div>
        </div>
        
        <Button 
          text="TAKE MY MONEY!"
          onClick={handleOrder}
          disabled={cartItems.length === 0 || orderStatus === 'loading'}
          styleClass="take-money-button"
        />
      </div>
    </div>
  );
};

export default OrderPage;


