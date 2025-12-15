import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/store/authSlice';

const ProtectedRoute = ({ redirectPath = '/login' }) => {
  // Selektor zamiast bezpośredniego odczytu stanu.
  // Dzięki temu komponent nie zależy od struktury całego stanu Redux.
  const isAuthenticated = useSelector(selectIsAuthenticated); // użycie selektora ze slice
  const location = useLocation(); // bieżąca lokalizacja użytkownika

  // Jeśli użytkownik zalogowany → renderuj Outlet (dzieci routingu)
  // Jeśli nie → przekieruj do login z informacją o stronie, z której przyszedł
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={redirectPath} state={{ from: location }} replace />
  ); // Parametr replace w <Navigate> działa tak, że zamienia bieżącą pozycję w historii przeglądarki, zamiast dodawać nowy wpis. Usuwa chronioną stronę z historii przeglądarki, aby kliknięcie „wstecz” nie wracało do niej.
};

export default ProtectedRoute;
