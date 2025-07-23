import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import { BookCheckoutPage } from './layouts/BookCheckoutPage/BookCheckoutPage';
import { HomePage } from './layouts/HomePage/HomePage';
import { Footer } from './layouts/NavbarAndFooter/Footer';
import { Navbar } from './layouts/NavbarAndFooter/Navbar';
import { SearchBooksPage } from './layouts/SearchBooksPage/SearchBooksPage';
import { useAuth0 } from '@auth0/auth0-react';
import { ReviewListPage } from './layouts/BookCheckoutPage/ReviewListPage/ReviewListPage';
import { ShelfPage } from './layouts/ShelfPage/ShelfPage';
import { MessagesPage } from './layouts/MessagesPage/MessagesPage';
import { ManageLibraryPage } from './layouts/ManageLibraryPage/ManageLibraryPage';
import { MembersPage } from './layouts/components/Members/MembersPage';
import ProtectedRoute from './layouts/Utils/ProtectedRoute';
import ViewMembers from './pages/ViewMembers';

export const App = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div className="text-center mt-5">Loading authentication...</div>;
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <div className="flex-grow-1">
        <Switch>
          <Route path="/" exact>
            <Redirect to="/home" />
          </Route>

          <Route path="/home">
            <HomePage />
          </Route>

          <Route path="/search">
            <SearchBooksPage />
          </Route>

          <Route path="/reviewlist/:bookId">
            <ReviewListPage />
          </Route>

          <Route path="/checkout/:bookId">
            <BookCheckoutPage />
          </Route>

          <Route path="/shelf">
            {isAuthenticated ? <ShelfPage /> : <Redirect to="/home" />}
          </Route>

          <Route path="/messages">
            {isAuthenticated ? <MessagesPage /> : <Redirect to="/home" />}
          </Route>

          <Route path="/admin">
            {isAuthenticated ? <ManageLibraryPage /> : <Redirect to="/home" />}
          </Route>

          <Route path="/members">
            {isAuthenticated ? <MembersPage /> : <Redirect to="/home" />}
          </Route>

          {/* Protected admin-only route for ViewMembers */}
          <ProtectedRoute
            path="/viewmembers"
            requiredRole="ADMIN"
            component={ViewMembers}
          />
        </Switch>
      </div>
      <Footer />
    </div>
  );
};
