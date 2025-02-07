const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const router = express.Router();

// Enable CORS for all routes
router.use(cors());

router.post('/create-checkout-session', async (req, res) => {
  try {
    const { cart, userId } = req.body;
    
    // Create line items from cart
    const lineItems = cart.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: [item.image],
          description: item.description || '',
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects amounts in cents
      },
      quantity: item.quantity || 1,
    }));

    // Create Stripe checkout session
    console.log('Creating checkout session with cart:', cart);
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cart`,
      metadata: {
        userId: userId || 'anonymous',
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/checkout-session/:sessionId', async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);
    res.json(session);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
