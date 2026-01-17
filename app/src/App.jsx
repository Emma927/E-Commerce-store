import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import Layout from '@/layout/Layout';
import { Spinner } from '@/components/common/Spinner';
import { Suspense, lazy } from 'react';
// Lazy loading wszystkich stron
const Home = lazy(() => import('@/pages/Home'));
const Products = lazy(() => import('@/pages/Products'));
const Product = lazy(() => import('@/pages/Product'));
const Cart = lazy(() => import('@/pages/Cart'));
const Favourites = lazy(() => import('@/pages/Favourites'));
const UserFavourites = lazy(() => import('@/pages/UserFavourites'));
const Login = lazy(() => import('@/pages/Login'));
const Checkout = lazy(() => import('@/pages/Checkout'));
const CheckoutSuccess = lazy(() => import('@/pages/CheckoutSuccess'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Profile = lazy(() => import('@/pages/Profile'));
const Orders = lazy(() => import('@/pages/Orders'));
const OrdersDetails = lazy(() => import('@/pages/OrdersDetails'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const ProtectedRoute = lazy(() => import('@/pages/ProtectedRoute'));

const App = () => {
  return (
    <Router>
      {/* Dzięki React.lazy + Suspense, początkowy bundle jest mniejszy → strona startowa ładuje się szybciej. */}
      {/* Bez React.lazy wszystkie komponenty stron są importowane statycznie, czyli podczas startu aplikacji cały kod trafia do głównego bundle’a. Niezależnie od tego, czy użytkownik odwiedzi daną stronę, czy nie – kod jest już w przeglądarce. */}
      {/* React.lazy + Suspense rozwiązuje ten problem, bo komponenty są ładowane dynamicznie (tzw. code splitting). Kod strony nie znajduje się w głównym bundle’u, tylko zostaje umieszczony w osobnym, dynamicznie ładowanym pliku JavaScript. Jest pobrany dopiero w momencie, gdy komponent zostanie wyrenderowany (np. użytkownik odwiedzi daną stronę). Kod nie jest w bundle głównym, tylko w osobnym pliku, który pobiera się dopiero „na żądanie”.*/}
      {/* Suspense w React to komponent, który pozwala „zawiesić” renderowanie części drzewa komponentów, dopóki dane lub moduły nie są gotowe. */}
      <Suspense fallback={<Spinner />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            {/* Produkty */}
            <Route path="products" element={<Products />} />
            {/* Strona pojedynczego produktu */}
            <Route path="product/:id" element={<Product />} />
            {/* Przeglad koszyka */}
            <Route path="cart" element={<Cart />} />
            {/* Finalizacja zamówienia */}
            <Route path="checkout" element={<Checkout />} />
            {/* Podsumowanie udanej transakcji */}
            <Route path="checkout/success" element={<CheckoutSuccess />} />
            {/* Przegląd ulubionych - dostępne dla gościa i zalogowanego użytkownika z pulpitu */}
            <Route path="favourites" element={<Favourites />} />
            {/* Logowanie */}
            <Route path="login" element={<Login />} />
            {/* Chronione routy */}
            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<Dashboard />}>
                {/* Atrybut replace używa się tylko przy przekierowaniach (Navigate), gdy chcemy uniknąć tworzenia nowego wpisu w historii.*/}
                {/* Aby URL był dokładnie /dashboard/profile, a nie /dashboard potrzebuja Navigate z replace. */}
                {/* Podsumowanie działania w historii przeglądarki
Użytkownik wpisuje /dashboard → od razu jest przekierowany do /dashboard/profile.
W historii przeglądarki nie pojawia się wpis /dashboard, tylko bezpośrednio /dashboard/profile.
Jeśli kliknie „wstecz” w przeglądarce, nie wróci do /dashboard, tylko do poprzedniej strony sprzed /dashboard. */}
                <Route index element={<Navigate to="profile" replace />} />
                <Route path="profile" element={<Profile />} />
                {/* Historia zamówień */}
                <Route path="orders" element={<Orders />} />
                {/* Detal zamówienia */}
                <Route path="orders/:id" element={<OrdersDetails />} />
                {/* Ulubione oferty użytokownika zalogowanego dostępne w pulpicie użytkownka */}
                <Route path="user-favourites" element={<UserFavourites />} />
              </Route>
            </Route>
            {/* Strona nieodnaleziona 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
