import './Button.scss'

import React from 'react'

//Dynamisk klass från props för styling, text för knapp, klick-funktion och om knappen inte ska gå att klicka på (disabled)

const Button = ({ text, onClick, styleClass, disabled}) => {
  return (
    <button
    className={`button ${styleClass}`} 
    onClick={onClick}
    disabled={disabled}
    > 
     {text}
      
    </button>
  )
}

export default Button
