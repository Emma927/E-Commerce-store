import { useMutation } from '@tanstack/react-query';
import { FAKE_API_URL } from '@/constants';

// POST – składanie zamówienia
const postOrder = async (orderData) => {
  const response = await fetch(`${FAKE_API_URL}/carts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData),
  });

  if (!response.ok) {
    throw new Error('Failed to place order');
  }

  const data = await response.json();
  return data;
};

export const usePostOrder = () => useMutation({ mutationFn: postOrder });
