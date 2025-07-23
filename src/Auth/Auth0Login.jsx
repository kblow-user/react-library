import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Redirect } from 'react-router-dom';
import { SpinnerLoading } from '../layouts/Utils/SpinnerLoading';
import Auth0SignIn from './Auth0SignIn';

const Auth0Login = () => {
  const { isLoading, isAuthenticated } = useAuth0();

  if (isLoading) {
    return <SpinnerLoading />;
  }

  return isAuthenticated ? <Redirect to="/" /> : <Auth0SignIn />;
};

export default Auth0Login;

