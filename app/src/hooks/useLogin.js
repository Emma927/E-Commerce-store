import { useMutation } from '@tanstack/react-query';
import { FAKE_API_URL } from '@/constants';

// React Query zajmuje się stanem ładowania, błędami, cache’em i refetchowaniem.
const loginRequest = async ({ username, password }) => {
  const response = await fetch(`${FAKE_API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Invalid username or password');
  }

  const data = await response.json();
  return data; // zwraca tylko token { token }
};

export const useLogin = () => useMutation({ mutationFn: loginRequest });
