import React from 'react';
import { Route, Redirect, RouteProps } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

interface ProtectedRouteProps extends RouteProps {
  requiredRole: string;
  component: React.ComponentType<any>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  requiredRole,
  ...rest
}) => {
  const { isAuthenticated, user, isLoading } = useAuth0();
  const NAMESPACE = 'https://react-library.com/roles';
  const roles = user && user[NAMESPACE];
  const isAuthorized = isAuthenticated && roles?.includes(requiredRole);

  if (isLoading) {
    return <div className="text-center mt-5">Loading authentication...</div>;
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthorized ? (
          <Component {...props} />
        ) : (
          <Redirect to="/home" />
        )
      }
    />
  );
};

export default ProtectedRoute;
