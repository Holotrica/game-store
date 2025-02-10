import React from 'react';
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import { signInWithFacebook, signInWithGoogle } from '../utils/auth';

const Login = () => {
  const { loginWithGoogle, loginWithFacebook } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await loginWithFacebook();
      navigate('/');
    } catch (error) {
      console.error('Facebook login error:', error);
    }
  };

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