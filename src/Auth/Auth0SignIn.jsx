import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const Auth0SignIn = () => {
  const { loginWithRedirect, isAuthenticated } = useAuth0();

  if (isAuthenticated) {
    return <div className="text-center mt-5">You are already logged in.</div>;
  }

  return (
    <div className="container mt-5 mb-5 text-center">
      <h2>Please log in</h2>
      <button className="btn btn-primary" onClick={() => loginWithRedirect()}>
        Log In with Auth0
      </button>
    </div>
  );
};

export default Auth0SignIn;
