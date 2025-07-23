import { useEffect, useState } from 'react';
import { SpinnerLoading } from '../Utils/SpinnerLoading';
import BookModel from '../../models/BookModel';
import { Pagination } from '../Utils/Pagination';
import { ChangeQuantityOfBook } from './components/ChangeQuantityOfBook';
import DeleteBook   from './components/DeleteBook';
import { AddNewBook } from './components/AddNewBook';
import { useAuth0 } from '@auth0/auth0-react';

export const ManageLibraryPage = () => {
  const { isAuthenticated, getAccessTokenSilently } = useAuth0();

  const [books, setBooks] = useState<BookModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(0);

  const [updateBookTriggered, setUpdateBookTriggered] = useState(false);

  useEffect(() => {
    const fetchBooks = async () => {
      if (!isAuthenticated) return;

      try {
        const token = await getAccessTokenSilently();
        const url = `https://localhost:8443/api/books?page=${currentPage - 1}&size=${booksPerPage}`;
        const response = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }

        const data = await response.json();
        setBooks(data._embedded.books);
        setTotalPages(data.page.totalPages);
        setIsLoading(false);
      } catch (error: any) {
        setHttpError(error.message);
        setIsLoading(false);
      }
    };

    fetchBooks();
    window.scrollTo(0, 0);
  }, [isAuthenticated, getAccessTokenSilently, currentPage, booksPerPage, updateBookTriggered]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const triggerUpdate = () => setUpdateBookTriggered(!updateBookTriggered);

  if (isLoading) {
    return <SpinnerLoading />;
  }

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <AddNewBook />
      {books.length > 0 ? (
        <>
          <h5 className="mt-3">Manage Books:</h5>
          {books.map((book) => (
            <div key={book.id} className="card mt-3 shadow p-3">
              <div className="d-flex justify-content-between">
                <div>
                  <h6>{book.title}</h6>
                  <p className="mb-1">Author: {book.author}</p>
                  <p className="mb-1">Category: {book.category}</p>
                  <p className="mb-1">Description: {book.description}</p>
                  <p>Copies: {book.copies}</p>
                </div>
                <div className="d-flex flex-column align-items-end">
                  <ChangeQuantityOfBook book={book} onUpdate={triggerUpdate} />
                  <DeleteBook bookId={book.id} onDelete={triggerUpdate} />
                </div>
              </div>
            </div>
          ))}
        </>
      ) : (
        <h5 className="mt-3">No books found.</h5>
      )}
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
      )}
    </div>
  );
};
