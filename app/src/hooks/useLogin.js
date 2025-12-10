import { useMutation } from '@tanstack/react-query';
// import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
import { FAKE_API_URL } from '@/constants';
// import { login } from '@/store/userSlice';

/**
 🔹 Zasada wspólna

Oddzielasz logikę fetch/mutate od komponentu → czysty kod.

Custom hook zwraca wszystko, co potrzebujesz w komponencie: status, dane, metody.

React Query zajmuje się stanem ładowania, błędami, cache’em i refetchowaniem.
 */
const loginRequest = async ({ username, password }) => {
  //  const response = await fetch(`${API_URL}/auth/login`
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

// 💡 W skrócie:
// useLogin.username → wartość z formularza do logowania
// useUser.username → wartość z API, część pełnego profilu użytkownika
// Funkcja strzałkowa bez klamer i return:
export const useLogin = () => useMutation({ mutationFn: loginRequest });