import { useQuery } from '@tanstack/react-query';
import { FAKE_API_URL } from '@/constants';

const fetchProduct = async (id) => {
  const response = await fetch(`${FAKE_API_URL}/products/${id}`);
  if (!response.ok) throw new Error('Cannot GET the product');
  const data = await response.json();
  return data; // pojedynczy obiekt
};

export const useProduct = (id) =>
  useQuery({
    queryKey: ['product', id], // queryKey pełni rolę tablicy zależności
    queryFn: () => fetchProduct(id),
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 10,
    retry: 1,
    enabled: !!id, // fetchuje tylko jeśli id istnieje
  });