import React from 'react';
import { useSelector } from 'react-redux';
import logoWhite from '../../assets/logo-white.png';
import cartIcon from '../../assets/cart-bag.png';
import './Header.scss';
import { useNavigate } from 'react-router-dom';

const Header = ({ 
  showCart = true, 
  showLogo = true, 
  logoOnly = false,
  cartOnly = false  
}) => {
  const navigate = useNavigate();

  // Hämta antal varor i varukorgen från Redux
  const cartCount = useSelector((state) => state.order.cartCount);

  const handleClick = () => {
    navigate('/order');
  };

  // Bestäm header-klass baserat på props
  let headerClass = '';
  if (logoOnly) headerClass = 'logo-only';
  if (cartOnly) headerClass = 'cart-only';

  return (
    <header className={headerClass}>
      <section className="header-container">
        {showLogo && !cartOnly && (
          <div className="logo-container">
            <img className="logo-white" src={logoWhite} alt="logo" />
          </div>
        )}
        
        {showCart && !logoOnly && (
          <button className="button-cart" onClick={handleClick}>
            <img className="cart-icon" src={cartIcon} alt="cart-icon" />
            <span className="cart-item-count">{cartCount}</span>
          </button>
        )}
      </section>
    </header>
  );
};

export default Header;


