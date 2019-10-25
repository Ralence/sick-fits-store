import React from 'react';
import CartStyles from './styles/CartStyles';
import Supreme from './styles/Supreme';
import CloseButton from './styles/CloseButton';
import SickButton from './styles/SickButton';

const Cart = props => (
  <CartStyles open>
    <header>
      <CloseButton title="close">X</CloseButton>
      <Supreme>Your Cart</Supreme>
      <p>You have __ items in your cart</p>
    </header>

    <footer>
      <p>$10.10</p>
      <SickButton>Checkuot</SickButton>
    </footer>
  </CartStyles>
);

export default Cart;
