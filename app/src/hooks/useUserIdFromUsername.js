import { useQuery } from '@tanstack/react-query';
import { FAKE_API_URL } from '@/constants';
import { useSelector } from 'react-redux';
import { selectUsername } from '@/store/authSlice';

export const fetchUserIdByUsername = async (username) => {
  // Funkcję można używać też poza hookiem (np. w testach albo w innych miejscach), więc sprawdzenie if (!username) zabezpiecza ją przed błędami.
  // Nawet jeśli w hooku mamy enabled: !!username, w innych miejscach ktoś może przypadkowo wywołać funkcję z pustym username.
  if (!username) return null;

  const res = await fetch(`${FAKE_API_URL}/users`);
  const data = await res.json();
  const user = data.find((u) => u.username === username);
  return user?.id || null;
};

export const useUserIdFromUsername = () => {
  const username = useSelector(selectUsername);

  return useQuery({
    queryKey: ['userId', username], // Unikalny klucz w cache React Query, zależny od username; pozwala odróżnić różne zapytania
    queryFn: () => fetchUserIdByUsername(username), // Funkcja, która pobiera userId dla danego username z API
    enabled: !!username, // Hook fetchuje dane tylko jeśli username istnieje (zapobiega błędom przy undefined/null)
    initialData: null, // Wartość początkowa danych = null, dzięki czemu UI może np. pokazać Spinner zamiast błędu
  });
};
