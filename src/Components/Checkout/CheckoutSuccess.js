import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './CheckoutSuccess.module.css';

const CheckoutSuccess = () => {
  const [status, setStatus] = useState('loading');
  const location = useLocation();
  const navigate = useNavigate();
  
  useEffect(() => {
    const sessionId = new URLSearchParams(location.search).get('session_id');
    
    if (sessionId) {
      fetch(`/api/checkout-session/${sessionId}`)
        .then(response => response.json())
        .then(session => {
          if (session.payment_status === 'paid') {
            setStatus('success');
          } else {
            setStatus('failed');
          }
        })
        .catch(error => {
          console.error('Error fetching session:', error);
          setStatus('failed');
        });
    }
  }, [location.search]);

  const handleContinueShopping = () => {
    navigate('/browse');
  };

  return (
    <div className={styles.success_container}>
      {status === 'loading' && (
        <div className={styles.loading}>
          <h2>Processing your payment...</h2>
          <div className={styles.spinner}></div>
        </div>
      )}
      
      {status === 'success' && (
        <div className={styles.success}>
          <h1>Thank You for Your Purchase!</h1>
          <p>Your payment was successful and your order is being processed.</p>
          <p>You will receive an email confirmation shortly.</p>
          <button 
            onClick={handleContinueShopping}
            className={styles.continue_button}
          >
            Continue Shopping
          </button>
        </div>
      )}
      
      {status === 'failed' && (
        <div className={styles.failed}>
          <h1>Payment Failed</h1>
          <p>Something went wrong with your payment.</p>
          <p>Please try again or contact support if the problem persists.</p>
          <button 
            onClick={() => navigate('/cart')}
            className={styles.retry_button}
          >
            Return to Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default CheckoutSuccess;
