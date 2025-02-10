import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth } from "../../utils/AuthContext";
import { useNavigate } from "react-router-dom";
import styles from "./Checkout.module.css";

// Initialize Stripe
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const Checkout = ({ cart }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [calculatedTotal, setCalculatedTotal] = useState(0);

  useEffect(() => {
    // Calculate total with proper decimal handling
    const total = cart.reduce((sum, item) => {
      const price = parseFloat(item.price);
      const quantity = item.quantity || 1;
      return sum + price * quantity;
    }, 0);
    setCalculatedTotal(total.toFixed(2));
  }, [cart]);

  const handleCheckout = async () => {
    if (!user) {
      alert("Please sign in to proceed with checkout");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    try {
      if (!user) {
        alert("Please sign in to proceed with checkout");
        navigate("/login");
        return;
      }

      // Save cart to localStorage before checkout
      const orderHistory = JSON.parse(
        localStorage.getItem("orderHistory") || "[]"
      );
      const newOrder = {
        items: cart,
        total: calculatedTotal,
        date: new Date().toISOString(),
        userId: user.uid,
      };
      orderHistory.push(newOrder);
      localStorage.setItem("orderHistory", JSON.stringify(orderHistory));

      // Make sure we're using the correct API endpoint
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error("Stripe failed to initialize");
      }

      const response = await fetch(
        "https://stripe-backend-cyan.vercel.app/api/create-checkout-session",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            cart: cart,
            userId: user?.uid,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create checkout session");
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received from server");
      }
    } catch (error) {
      console.error("Error initiating checkout:", error);
      alert("Failed to initiate checkout. Please try again.");

      // Log the error for debugging
      console.error("Detailed error:", error);
    }
  };

  return (
    <div className={styles.checkout_container}>
      <div className={styles.order_summary}>
        <h2>Order Summary</h2>
        <div className={styles.cart_items}>
          {cart.map((item) => (
            <div key={item.id} className={styles.cart_item}>
              <img
                src={item.cover}
                alt={item.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder-image.jpg";
                }}
              />
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
          <h3>${calculatedTotal}</h3>
        </div>
        <button
          onClick={handleCheckout}
          className={styles.checkout_button}
          disabled={cart.length === 0}
        >
          {cart.length === 0 ? "Cart is Empty" : "Proceed to Checkout"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
