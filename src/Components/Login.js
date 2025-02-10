import React from 'react';
import './Login.css';
import { signInWithFacebook, signInWithGoogle } from '../utils/auth';

const Login = () => {
  return (
    <div className="login-container">
      <h2>Sign in</h2>
      <p>to continue to Game Store</p>
      <div className="social-buttons">
        <button className="facebook-btn" onClick={signInWithFacebook}>
          <img src="/Facebook.png" alt="Facebook" />
          Continue with Facebook
        </button>
        <button className="google-btn" onClick={signInWithGoogle}>
          <img src="/Google.png" alt="Google" />
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default Login;