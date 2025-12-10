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
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    enabled: !!userId && !!token,
    initialData: null, // Gdy enabled = false, React Query nie fetchuje i nie ustawia żadnej wartości data ani isPending
    // Jeśli nie ustawisz initialData, data może być undefined, a isPending może pozostać true w pierwszym renderze.
  // // <-- tu ustawiasz null, żeby UI nie pokazywało migających starych danych
  });
};

// import { useQuery } from '@tanstack/react-query';
// import { API_URL_FAKE } from '@/constants';
// import { useSelector } from 'react-redux';
// import { selectToken } from '@/redux-toolkit/userSlice';
//
// export const fetchUser = async (userId, token) => {
//   const response = await fetch(`${API_URL_FAKE}/users/${userId}`, {
//     headers: {
//         // ✅ Podsumowując: token nie jest potrzebny do pobrania danych testowych, ale w realnej aplikacji REST API token chroni prywatne dane użytkownika.
//       Authorization: `Bearer ${token}`, // używamy tokena z Redux
//     },
//   });
//   if (!response.ok) throw new Error('Failed to fetch user');
//   return response.json();
// };
//
// export const useUser = (userId) => {
//   const token = useSelector(selectToken); // bierzemy token z Redux
//
//   return useQuery({
//     queryKey: ['user', userId],
//     queryFn: () => fetchUser(userId, token),
//     enabled: !!userId && !!token, // fetch tylko jeśli mamy userId i token
//   });
// };

//💡 W skrócie:
// useLogin.username → wartość z formularza do logowania
// useUser.username → wartość z API, część pełnego profilu użytkownika

// export const fetchUser = async (userId, token) => {
//   const response = await fetch(`${API_URL_FAKE}/users/${userId}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   if (!response.ok) throw new Error('Failed to fetch user');
//   const data = await response.json();
//   return data; // zwraca pełny obiekt user
// };
//
// export const useUser = (userId, token) => {
//   return useQuery({
//     queryKey: ['user', userId],
//     queryFn: () => fetchUser(userId, token),
//     enabled: !!token && !!userId,
//   });
// };
