import { FC } from 'react';
import ReviewModel from '../../models/ReviewModel';

interface ReviewProps {
  review: ReviewModel;
}

export const Review: FC<ReviewProps> = ({ review }) => {
  const { userEmail, date, rating, reviewDescription } = review;

  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  const renderStars = (count: number) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={i < count ? 'text-warning' : 'text-muted'}>
          ★
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="col-md-12 mb-3">
      <div className="card shadow-sm p-3">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="mb-0">{userEmail}</h6>
            <small className="text-muted">{formattedDate}</small>
          </div>
          <div className="text-end fs-5">{renderStars(rating)}</div>
        </div>
        {reviewDescription && (
          <p className="mt-2 mb-0">{reviewDescription}</p>
        )}
      </div>
    </div>
  );
};
