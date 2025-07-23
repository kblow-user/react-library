import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import BookModel from '../../models/BookModel';
import { SpinnerLoading } from '../Utils/SpinnerLoading';

export const BookCheckoutPage = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();
  const { bookId } = useParams<{ bookId: string }>();

  const [book, setBook] = useState<BookModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  useEffect(() => {
    const fetchBookDetails = async () => {
      if (!isAuthenticated) return;

      try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`https://localhost:8443/api/books/${bookId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch book details');
        }

        const data = await response.json();
        setBook(data);
      } catch (error: any) {
        setHttpError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookDetails();
    window.scrollTo(0, 0);
  }, [isAuthenticated, getAccessTokenSilently, bookId]);

  const handleCheckout = async () => {
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`https://localhost:8443/api/books/checkout/${bookId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to checkout book');
      }

      setCheckoutSuccess(true);
    } catch (error: any) {
      setHttpError(error.message);
    }
  };

  if (isLoading) return <SpinnerLoading />;
  if (httpError) {
    return (
      <div className="container mt-5">
        <p className="text-danger">Error: {httpError}</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      {book ? (
        <>
          <h3>Checkout Book</h3>
          <div className="card p-4 shadow">
            <h5>{book.title}</h5>
            <p>Author: {book.author}</p>
            <p>Category: {book.category}</p>
            <p>Description: {book.description}</p>
            <p>Available Copies: {book.copiesAvailable}</p>
            <button
              className="btn btn-success mt-3"
              onClick={handleCheckout}
              disabled={checkoutSuccess}
            >
              {checkoutSuccess ? 'Checked Out' : 'Checkout'}
            </button>
          </div>
        </>
      ) : (
        <p>No book found.</p>
      )}
    </div>
  );
};
// export default BookCheckoutPage;