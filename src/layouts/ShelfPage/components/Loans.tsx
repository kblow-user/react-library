import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ShelfCurrentLoans from '../../../models/ShelfCurrentLoans';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';
import { LoansModal } from './LoansModal';

export const Loans = () => {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [httpError, setHttpError] = useState<string | null>(null);

    // Current Loans
    const [shelfCurrentLoans, setShelfCurrentLoans] = useState<ShelfCurrentLoans[]>([]);
    const [isLoadingUserLoans, setIsLoadingUserLoans] = useState(true);
    const [checkout, setCheckout] = useState(false);

    useEffect(() => {
        const fetchUserCurrentLoans = async () => {
            if (isAuthenticated) {
                try {
                    const token = await getAccessTokenSilently();
                    const url = `https://localhost:8443/api/books/secure/currentloans`;
                    const requestOptions = {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    };

                    const response = await fetch(url, requestOptions);
                    if (!response.ok) {
                        throw new Error('Something went wrong!');
                    }

                    const responseJson = await response.json();
                    setShelfCurrentLoans(responseJson);
                } catch (error: any) {
                    setHttpError(error.message);
                }
            }
            setIsLoadingUserLoans(false);
        };

        fetchUserCurrentLoans();
        window.scrollTo(0, 0);
    }, [isAuthenticated, getAccessTokenSilently, checkout]);

    if (isLoadingUserLoans) {
        return <SpinnerLoading />;
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    const returnBook = async (bookId: number) => {
        try {
            const token = await getAccessTokenSilently();
            const url = `https://localhost:8443/api/books/secure/return/?bookId=${bookId}`;
            const requestOptions = {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            setCheckout(!checkout);
        } catch (error: any) {
            setHttpError(error.message);
        }
    };

    const renewLoan = async (bookId: number) => {
        try {
            const token = await getAccessTokenSilently();
            const url = `https://localhost:8443/api/books/secure/renew/loan/?bookId=${bookId}`;
            const requestOptions = {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            };

            const response = await fetch(url, requestOptions);
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            setCheckout(!checkout);
        } catch (error: any) {
            setHttpError(error.message);
        }
    };

    return (
        <div>
            {/* Desktop */}
            <div className="d-none d-lg-block mt-2">
                {shelfCurrentLoans.length > 0 ? (
                    <>
                        <h5>Current Loans: </h5>
                        {shelfCurrentLoans.map((loan) => (
                            <div key={loan.book.id}>
                                <div className="row mt-3 mb-3">
                                    <div className="col-4 col-md-4 container">
                                        <img
                                            src={
                                                loan.book?.img ||
                                                require('./../../../Images/BooksImages/book-luv2code-1000.png')
                                            }
                                            width="226"
                                            height="349"
                                            alt="Book"
                                        />
                                    </div>
                                    <div className="card col-3 col-md-3 container d-flex">
                                        <div className="card-body">
                                            <div className="mt-3">
                                                <h4>Loan Options</h4>
                                                {loan.daysLeft > 0 && (
                                                    <p className="text-secondary">
                                                        Due in {loan.daysLeft} days.
                                                    </p>
                                                )}
                                                {loan.daysLeft === 0 && (
                                                    <p className="text-success">Due Today.</p>
                                                )}
                                                {loan.daysLeft < 0 && (
                                                    <p className="text-danger">
                                                        Past due by {Math.abs(loan.daysLeft)} days.
                                                    </p>
                                                )}
                                                <div className="list-group mt-3">
                                                    <button
                                                        className="list-group-item list-group-item-action"
                                                        aria-current="true"
                                                        data-bs-toggle="modal"
                                                        data-bs-target={`#modal${loan.book.id}`}
                                                    >
                                                        Manage Loan
                                                    </button>
                                                    <Link
                                                        to="search"
                                                        className="list-group-item list-group-item-action"
                                                    >
                                                        Search more books?
                                                    </Link>
                                                </div>
                                            </div>
                                            <hr />
                                            <p className="mt-3">
                                                Help others find their adventure by reviewing your loan.
                                            </p>
                                            <Link
                                                className="btn btn-primary"
                                                to={`/checkout/${loan.book.id}`}
                                            >
                                                Leave a review
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                                <hr />
                                <LoansModal
                                    shelfCurrentLoan={loan}
                                    mobile={false}
                                    returnBook={returnBook}
                                    renewLoan={renewLoan}
                                />
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        <h3 className="mt-3">Currently no loans</h3>
                        <Link className="btn btn-primary" to="search">
                            Search for a new book
                        </Link>
                    </>
                )}
            </div>

            {/* Mobile */}
            <div className="container d-lg-none mt-2">
                {shelfCurrentLoans.length > 0 ? (
                    <>
                        <h5 className="mb-3">Current Loans: </h5>
                        {shelfCurrentLoans.map((loan) => (
                            <div key={loan.book.id}>
                                <div className="d-flex justify-content-center align-items-center">
                                    <img
                                        src={
                                            loan.book?.img ||
                                            require('./../../../Images/BooksImages/book-luv2code-1000.png')
                                        }
                                        width="226"
                                        height="349"
                                        alt="Book"
                                    />
                                </div>
                                <div className="card d-flex mt-5 mb-3">
                                    <div className="card-body container">
                                        <div className="mt-3">
                                            <h4>Loan Options</h4>
                                            {loan.daysLeft > 0 && (
                                                <p className="text-secondary">
                                                    Due in {loan.daysLeft} days.
                                                </p>
                                            )}
                                            {loan.daysLeft === 0 && (
                                                <p className="text-success">Due Today.</p>
                                            )}
                                            {loan.daysLeft < 0 && (
                                                <p className="text-danger">
                                                    Past due by {Math.abs(loan.daysLeft)} days.
                                                </p>
                                            )}
                                            <div className="list-group mt-3">
                                                <button
                                                    className="list-group-item list-group-item-action"
                                                    aria-current="true"
                                                    data-bs-toggle="modal"
                                                    data-bs-target={`#mobilemodal${loan.book.id}`}
                                                >
                                                    Manage Loan
                                                </button>
                                                <Link
                                                    to="search"
                                                    className="list-group-item list-group-item-action"
                                                >
                                                    Search more books?
                                                </Link>
                                            </div>
                                        </div>
                                        <hr />
                                        <p className="mt-3">
                                            Help others find their adventure by reviewing your loan.
                                        </p>
                                        <Link
                                            className="btn btn-primary"
                                            to={`/checkout/${loan.book.id}`}
                                        >
                                            Leave a review
                                        </Link>
                                    </div>
                                </div>
                                <hr />
                                <LoansModal
                                    shelfCurrentLoan={loan}
                                    mobile={true}
                                    returnBook={returnBook}
                                    renewLoan={renewLoan}
                                />
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        <h3 className="mt-3">Currently no loans</h3>
                        <Link className="btn btn-primary" to="search">
                            Search for a new book
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
};
