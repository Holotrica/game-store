import React from 'react';
import FacebookLogin from 'react-facebook-login';
import { signInWithGoogle, handleFacebookLogin, handleSignOut } from '../utils/auth';
import { useAuth } from '../utils/AuthContext';

const Login = () => {
  const { user } = useAuth();

  const onGoogleSignIn = async () => {
    const result = await signInWithGoogle();
    if (!result.success) {
      console.error('Google sign-in failed:', result.error);
    }
  };

  const responseFacebook = async (response) => {
    const result = await handleFacebookLogin(response);
    if (!result.success) {
      console.error('Facebook sign-in failed:', result.error);
    }
  };

  const onSignOut = async () => {
    const result = await handleSignOut();
    if (!result.success) {
      console.error('Sign out failed:', result.error);
    }
  };

  return (
    <div className="login-container">
      {!user ? (
        <>
          <button
            onClick={onGoogleSignIn}
            className="google-login-btn"
          >
            Sign in with Google
          </button>
          <FacebookLogin
            appId={process.env.REACT_APP_FACEBOOK_APP_ID}
            autoLoad={false}
            fields="name,email,picture"
            callback={responseFacebook}
            cssClass="facebook-login-btn"
            icon="fa-facebook"
          />
        </>
      ) : (
        <div className="user-info">
          <img
            src={user.photoURL}
            alt="Profile"
            className="profile-image"
          />
          <p>Welcome, {user.displayName}</p>
          <button
            onClick={onSignOut}
            className="signout-btn"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

export default Login;
