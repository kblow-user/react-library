import { FC } from 'react';

interface DeleteBookProps {
  bookId: number;
  onDelete: () => void;
}

const DeleteBook: FC<DeleteBookProps> = ({ bookId, onDelete }) => {
  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this book?');

    if (!confirmDelete) return;

    try {
      const response = await fetch(`https://localhost:8443/api/books/${bookId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete the book');
      }

      onDelete(); // Notify parent to refresh
    } catch (error: any) {
      console.error('Delete failed:', error.message);
    }
  };

  return (
    <button className="btn btn-danger btn-sm mt-2" onClick={handleDelete}>
      Delete Book
    </button>
  );
};

export default DeleteBook;
