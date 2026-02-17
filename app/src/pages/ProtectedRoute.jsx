import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectIsLoadingUser } from '@/store/authSlice';
import { Spinner } from '@/components/common/Spinner';

const ProtectedRoute = ({ redirectPath = '/login' }) => {
  // Selektor zamiast bezpośredniego odczytu stanu.
  // Dzięki temu komponent nie zależy od struktury całego stanu Redux.
  const isAuthenticated = useSelector(selectIsAuthenticated); // użycie selektora ze slice
  const location = useLocation(); // bieżąca lokalizacja użytkownika
  const isLoadingUser = useSelector(selectIsLoadingUser); // isLoadingUser – wskaźnik ładowania danych użytkownika,

  // Blokada dopóki Redux nie przetworzy stanu z localStorage.
  // Jeśli stan użytkownika wciąż się ładuje, nie renderujemy niczego i nie wykonujemy przekierowania.
  // Dzięki temu unikamy sytuacji, w której aplikacja od razu przekierowuje niezalogowanego użytkownika, zanim stan zostanie ustalony.
  if (isLoadingUser) {
    return <Spinner />;
  }
  // Jeśli użytkownik zalogowany → renderuj Outlet (dzieci routingu)
  // Jeśli nie → przekieruj do login z informacją o stronie, z której przyszedł
  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={redirectPath} state={{ from: location }} />
  );
};

export default ProtectedRoute;
