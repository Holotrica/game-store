import React, { useEffect, useState } from 'react';
import { useAuth } from '../../utils/AuthContext';
import styles from './OrderHistory.module.css';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      // Load order history from localStorage
      const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      // Filter orders for current user
      const userOrders = orderHistory.filter(order => order.userId === user.uid);
      setOrders(userOrders);
    }
  }, [user]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={styles.history_container}>
      <h2>Order History</h2>
      {orders.length === 0 ? (
        <p>No previous orders found.</p>
      ) : (
        <div className={styles.orders_list}>
          {orders.map((order, index) => (
            <div key={index} className={styles.order_card}>
              <div className={styles.order_header}>
                <h3>Order Date: {formatDate(order.date)}</h3>
                <p className={styles.total}>Total: ${order.total}</p>
              </div>
              <div className={styles.order_items}>
                {order.items.map((item, itemIndex) => (
                  <div key={itemIndex} className={styles.order_item}>
                    <img 
                      src={item.imageUrl || item.image || '/placeholder-image.jpg'}
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/placeholder-image.jpg';
                      }}
                    />
                    <div className={styles.item_details}>
                      <h4>{item.name}</h4>
                      <p>Quantity: {item.quantity || 1}</p>
                      <p>${item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
