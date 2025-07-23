import { useAuth0 } from '@auth0/auth0-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HistoryModel from '../../../models/HistoryModel';
import { Pagination } from '../../Utils/Pagination';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';

export const HistoryPage = () => {
    const { isAuthenticated, user, getAccessTokenSilently } = useAuth0();
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [httpError, setHttpError] = useState<string | null>(null);

    // Histories
    const [histories, setHistories] = useState<HistoryModel[]>([]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchUserHistory = async () => {
            if (!isAuthenticated || !user?.email) {
                setIsLoadingHistory(false);
                return;
            }

            try {
                const token = await getAccessTokenSilently();
                const url = `https://localhost:8443/api/histories/search/findBooksByUserEmail/?userEmail=${user.email}&page=${currentPage - 1}&size=5`;
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

                const data = await response.json();
                setHistories(data._embedded.histories);
                setTotalPages(data.page.totalPages);
            } catch (error: any) {
                setHttpError(error.message);
            }

            setIsLoadingHistory(false);
        };

        fetchUserHistory();
    }, [isAuthenticated, user, getAccessTokenSilently, currentPage]);

    if (isLoadingHistory) {
        return <SpinnerLoading />;
    }

    if (httpError) {
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="mt-2">
            {histories.length > 0 ? (
                <>
                    <h5>Recent History:</h5>
                    {histories.map((history) => (
                        <div key={history.id}>
                            <div className="card mt-3 shadow p-3 mb-3 bg-body rounded">
                                <div className="row g-0">
                                    <div className="col-md-2">
                                        <div className="d-none d-lg-block">
                                            <img
                                                src={
                                                    history.img ||
                                                    require('./../../../Images/BooksImages/book-luv2code-1000.png')
                                                }
                                                width="123"
                                                height="196"
                                                alt="Book"
                                            />
                                        </div>
                                        <div className="d-lg-none d-flex justify-content-center align-items-center">
                                            <img
                                                src={
                                                    history.img ||
                                                    require('./../../../Images/BooksImages/book-luv2code-1000.png')
                                                }
                                                width="123"
                                                height="196"
                                                alt="Book"
                                            />
                                        </div>
                                    </div>
                                    <div className="col">
                                        <div className="card-body">
                                            <h5 className="card-title">{history.author}</h5>
                                            <h4>{history.title}</h4>
                                            <p className="card-text">{history.description}</p>
                                            <hr />
                                            <p className="card-text">
                                                Checked out on: {history.checkoutDate}
                                            </p>
                                            <p className="card-text">
                                                Returned on: {history.returnedDate}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr />
                        </div>
                    ))}
                </>
            ) : (
                <>
                    <h3 className="mt-3">Currently no history:</h3>
                    <Link className="btn btn-primary" to={'/search'}>
                        Search for new book
                    </Link>
                </>
            )}

            {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
            )}
        </div>
    );
};
