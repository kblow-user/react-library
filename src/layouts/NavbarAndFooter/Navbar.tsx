import { NavLink } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { SpinnerLoading } from '../Utils/SpinnerLoading';

export const Navbar = () => {
  const { isAuthenticated, loginWithRedirect, user, logout, isLoading } = useAuth0();


  if (isLoading) {
    return <SpinnerLoading />;
  }

  const handleLogin = () => loginWithRedirect();

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  };

  const NAMESPACE = 'https://react-library.com/roles';
  const roles: string[] = user?.[NAMESPACE] || [];
  const isAdmin = roles.includes('ADMIN');

  console.log('User:', user);
  return (
    <nav className='navbar navbar-expand-lg navbar-dark main-color py-3'>
      <div className='container-fluid'>
        <span className='navbar-brand'>Love to Read</span>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbarNavDropdown'
          aria-controls='navbarNavDropdown'
          aria-expanded='false'
          aria-label='Toggle Navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>
        <div className='collapse navbar-collapse' id='navbarNavDropdown'>
          <ul className='navbar-nav'>
            <li className='nav-item'>
              <NavLink className='nav-link' to='/home'>Home</NavLink>
            </li>
            <li className='nav-item'>
              <NavLink className='nav-link' to='/search'>Search Books</NavLink>
            </li>
            {isAuthenticated && (
              <li className='nav-item'>
                <NavLink className='nav-link' to='/shelf'>Shelf</NavLink>
              </li>
            )}
            {isAuthenticated && isAdmin && (
              <>
                <li className='nav-item'>
                  <NavLink className='nav-link' to='/admin'>Admin</NavLink>
                </li>
                <li className='nav-item'>
                  <NavLink className='nav-link' to='/members'>Members</NavLink>
                </li>
              </>
            )}
          </ul>
          <ul className='navbar-nav ms-auto'>
            {!isAuthenticated ? (
              <li className='nav-item m-1'>
                <button className='btn btn-outline-light' onClick={handleLogin}>
                  Sign in
                </button>
              </li>
            ) : (
              <li className='nav-item m-1'>
                <button className='btn btn-outline-light' onClick={handleLogout}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
