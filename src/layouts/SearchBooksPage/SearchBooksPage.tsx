import { useEffect, useState } from 'react';
import BookModel from '../../models/BookModel';
import { Pagination } from '../Utils/Pagination';
import { SpinnerLoading } from '../Utils/SpinnerLoading';
import { SearchBook } from './components/SearchBook';

export const SearchBooksPage = () => {
    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage] = useState(5);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [categorySelection, setCategorySelection] = useState('Book category');

    useEffect(() => {
        const controller = new AbortController();
        const fetchBooks = async () => {
            setIsLoading(true);
            try {
                const baseUrl = 'https://localhost:8443/api/books';
                const url =
                    searchUrl === ''
                        ? `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`
                        : baseUrl + searchUrl.replace('<pageNumber>', `${currentPage - 1}`);

                const response = await fetch(url, { signal: controller.signal });
                if (!response.ok) {
                    throw new Error('Something went wrong!');
                }

                const data = await response.json();
                const responseData = data._embedded?.books;
                if (!responseData) {
                    throw new Error('No books found');
                }

                const loadedBooks: BookModel[] = responseData.map((book: any) => ({
                    id: book.id,
                    title: book.title,
                    author: book.author,
                    description: book.description,
                    copies: book.copies,
                    copiesAvailable: book.copiesAvailable,
                    category: book.category,
                    img: book.img,
                }));

                setBooks(loadedBooks);
                setTotalAmountOfBooks(data.page.totalElements);
                setTotalPages(data.page.totalPages);
            } catch (error: any) {
                if (error.name !== 'AbortError') {
                    setHttpError(error.message);
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooks();
        window.scrollTo(0, 0);

        return () => controller.abort(); // Cleanup on unmount or dependency change
    }, [currentPage, searchUrl, booksPerPage]);

    const searchHandleChange = () => {
        setCurrentPage(1);
        if (search.trim() === '') {
            setSearchUrl('');
        } else {
            setSearchUrl(`/search/findByTitleContaining?title=${search}&page=<pageNumber>&size=${booksPerPage}`);
        }
        setCategorySelection('Book category');
    };

    const categoryField = (value: string) => {
        setCurrentPage(1);
        const validCategories = ['fe', 'be', 'data', 'devops'];
        if (validCategories.includes(value.toLowerCase())) {
            setCategorySelection(value);
            setSearchUrl(`/search/findByCategory?category=${value}&page=<pageNumber>&size=${booksPerPage}`);
        } else {
            setCategorySelection('All');
            setSearchUrl(`?page=<pageNumber>&size=${booksPerPage}`);
        }
    };

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    const indexOfFirstBook = (currentPage - 1) * booksPerPage;
    const lastItem = Math.min(currentPage * booksPerPage, totalAmountOfBooks);

    if (isLoading) return <SpinnerLoading />;
    if (httpError)
        return (
            <div className="container m-5">
                <p>{httpError}</p>
            </div>
        );

    return (
        <div className="container">
            <div className="row mt-5">
                <div className="col-6">
                    <div className="d-flex">
                        <input
                            className="form-control me-2"
                            type="search"
                            placeholder="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <button className="btn btn-outline-success" onClick={searchHandleChange}>
                            Search
                        </button>
                    </div>
                </div>
                <div className="col-4">
                    <div className="dropdown">
                        <button
                            className="btn btn-secondary dropdown-toggle"
                            type="button"
                            id="dropdownMenuButton1"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            {categorySelection}
                        </button>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                            {['All', 'FE', 'BE', 'Data', 'DevOps'].map((category) => (
                                <li key={category}>
                                    <button
                                        className="dropdown-item"
                                        onClick={() => categoryField(category)}
                                    >
                                        {category === 'FE'
                                            ? 'Front End'
                                            : category === 'BE'
                                            ? 'Back End'
                                            : category}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>

            {totalAmountOfBooks > 0 ? (
                <>
                    <div className="mt-3">
                        <h5>Number of results: ({totalAmountOfBooks})</h5>
                        <p>
                            {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items:
                        </p>
                    </div>
                    {books.map((book) => (
                        <SearchBook book={book} key={book.id} />
                    ))}
                </>
            ) : (
                <div className="m-5">
                    <h3>Can't find what you are looking for?</h3>
                    <button className="btn main-color btn-md px-4 me-md-2 fw-bold text-white">
                        Library Services
                    </button>
                </div>
            )}

            {totalPages > 1 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
            )}
        </div>
    );
};
