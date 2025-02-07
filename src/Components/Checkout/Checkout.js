import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../../utils/AuthContext';
import styles from './Checkout.module.css';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const Checkout = ({ cart, totalAmount }) => {
  const { user } = useAuth();

  const handleCheckout = async () => {
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cart: cart,
          userId: user?.uid,
        }),
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error initiating checkout:', error);
    }
  };

  return (
    <div className={styles.checkout_container}>
      <div className={styles.order_summary}>
        <h2>Order Summary</h2>
        <div className={styles.cart_items}>
          {cart.map((item) => (
            <div key={item.id} className={styles.cart_item}>
              <img src={item.image} alt={item.name} />
              <div className={styles.item_details}>
                <h3>{item.name}</h3>
                <p>Quantity: {item.quantity || 1}</p>
                <p>${item.price}</p>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.total}>
          <h3>Total Amount:</h3>
          <h3>${totalAmount}</h3>
        </div>
        <button 
          onClick={handleCheckout}
          className={styles.checkout_button}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Checkout;
