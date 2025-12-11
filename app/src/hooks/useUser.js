import { useUserIdFromUsername } from './useUserIdFromUsername';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { selectToken } from '@/store/authSlice';
import { FAKE_API_URL } from '@/constants';

const fetchUser = async (userId) => {
  const response = await fetch(`${FAKE_API_URL}/users/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  const data = await response.json();
  return data;
};

export const useUser = () => {
  const token = useSelector(selectToken);
  const { data: userId } = useUserIdFromUsername();

  return useQuery({
    queryKey: ['user', userId], // Unikalny klucz query w cache, zależny od userId
    queryFn: () => fetchUser(userId), // Funkcja pobierająca dane użytkownika z API
    enabled: !!userId && !!token, // Fetch wykonany tylko, jeśli istnieje userId i token
    initialData: null, // Gdy enabled = false, React Query nie fetchuje i nie ustawia żadnej wartości i data pozostaje null.
    // Wartość początkowa data = null, bo na początku może nie być userId lub token
    // Dzięki temu komponent nie dostanie undefined i nie wywoła błędu przy próbie odczytu user.data
  });
};
