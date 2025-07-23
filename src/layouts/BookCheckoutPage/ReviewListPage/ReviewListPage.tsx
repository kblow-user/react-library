import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReviewModel from '../../../models/ReviewModel';
import { Pagination } from '../../Utils/Pagination';
import { Review } from '../../Utils/Review';
import { SpinnerLoading } from '../../Utils/SpinnerLoading';

interface RouteParams {
  id: string;
}

export const ReviewListPage = () => {
  const { id: bookId } = useParams<RouteParams>();

  const [reviews, setReviews] = useState<ReviewModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const fetchBookReviews = async () => {
      try {
        const response = await fetch(
          `https://localhost:8443/api/reviews/search/findByBookId?bookId=${bookId}&page=${currentPage - 1}&size=${reviewsPerPage}`
        );

        if (!response.ok) {
          throw new Error('Something went wrong while fetching reviews.');
        }

        const data = await response.json();
        const fetchedReviews = data._embedded?.reviews || [];

        const loadedReviews: ReviewModel[] = fetchedReviews.map((review: any) => ({
          id: review.id,
          userEmail: review.userEmail,
          date: review.date,
          rating: review.rating,
          book_id: review.book_id,
          reviewDescription: review.reviewDescription,
        }));

        setReviews(loadedReviews);
        setTotalAmountOfReviews(data.page.totalElements);
        setTotalPages(data.page.totalPages);
      } catch (error: any) {
        setHttpError(error.message || 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookReviews();
  }, [bookId, currentPage]);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (isLoading) return <SpinnerLoading />;
  if (httpError) {
    return (
      <div className="container m-5">
        <p className="text-danger">Error: {httpError}</p>
      </div>
    );
  }

  const indexOfFirstReview = (currentPage - 1) * reviewsPerPage;
  const indexOfLastReview = Math.min(currentPage * reviewsPerPage, totalAmountOfReviews);

  return (
    <div className="container mt-5">
      <h3>Comments ({totalAmountOfReviews})</h3>
      <p>
        {indexOfFirstReview + 1} to {indexOfLastReview} of {totalAmountOfReviews} items:
      </p>
      <div className="row">
        {reviews.map((review) => (
          <Review review={review} key={review.id} />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate} />
      )}
    </div>
  );
};
