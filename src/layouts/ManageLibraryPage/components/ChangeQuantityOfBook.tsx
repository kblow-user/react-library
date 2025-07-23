import { FC, useState } from 'react';
import BookModel from '../../../models/BookModel';

interface ChangeQuantityOfBookProps {
  book: BookModel;
  onUpdate: () => void; 
}

export const ChangeQuantityOfBook: FC<ChangeQuantityOfBookProps> = ({ book, onUpdate }) => {
  const [quantity, setQuantity] = useState<number>(book.copies ?? 0);

  const handleQuantityChange = async (newQuantity: number) => {
    try {
      const response = await fetch(`https://localhost:8443/api/books/${book.id}/quantity`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to update quantity');
      }

      onUpdate(); 
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <input
        type="number"
        className="form-control mb-2"
        value={quantity}
        min={0}
        onChange={(e) => setQuantity(parseInt(e.target.value))}
      />
      <button
        className="btn btn-primary btn-sm"
        onClick={() => handleQuantityChange(quantity)}
      >
        Update Quantity
      </button>
    </div>
  );
};
