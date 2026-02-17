import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import HistoryIcon from '@mui/icons-material/History';
import StarIcon from '@mui/icons-material/Star';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

export const FAKE_API_URL = 'https://fakestoreapi.com';

// CAPITALIZE - funkcja, która zamienia pierwszą literę wyrazu na wielką literę.
export const CAPITALIZE = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// CAPITALIZE_WORDS - funkcja, która zamienia pierwszą literę każdego wyrazu na wielką literę.
export const CAPITALIZE_WORDS = (str) =>
  str
    // funkcja split dzieli string na tablicę słów według spacji
    // "john doe" -> ["john", "doe"]
    .split(' ')
    // Dla każdego słowa w tablicy:
    .map(
      (w) =>
        // Bierze pierwszą literę i zmienia ją na wielką
        // "john" -> "J"
        w.charAt(0).toUpperCase() +
        // Dokleja resztę słowa bez zmian
        // "ohn" -> "ohn"
        w.slice(1),
    )
    // Łączy z powrotem wszystkie słowa w jeden string, rozdzielając spacją
    // ["John", "Doe"] -> "John Doe"
    .join(' ');

// FORMAT_COMMAS - funkcja wyrównuje przecinki, czyli usuwa zbędne spacje przed/po przecinku i ustawia 1 spację po przecinku. Celem jest ujednolicenie formatowania list
export const FORMAT_COMMAS = (str) => str.replace(/\s*,\s*/g, ', ');

export const DELIVERY_OPTIONS = [
  { value: 'standard', label: 'Standard', price: 10 },
  { value: 'express', label: 'Express', price: 20 },
];

export const PAGE_SIZE = 6;

export const SOCIAL_MEDIA_SITES = [
  {
    icon: FacebookIcon,
    address: 'https://www.facebook.com/e-commmerce-store',
    label: 'E-Commerce store Facebook',
    width: { xs: 23, md: 28 },
    height: { xs: 23, md: 28 },
  },
  {
    icon: InstagramIcon,
    address: 'https://www.instagram.com/e-commmerce-store',
    label: 'E-Commerce store Instagram',
    width: { xs: 23, md: 28 },
    height: { xs: 23, md: 28 },
  },
  {
    icon: YouTubeIcon,
    address: 'https://www.youtube.com/e-commmerce-store',
    label: 'E-Commerce store Youtube',
    width: { xs: 23, md: 28 },
    height: { xs: 23, md: 28 },
  },
];

export const FEATURES = [
  {
    icon: ShoppingCartIcon,
    title: 'E-Commerce store',
    subtitle: 'Online shopping',
  },
  {
    icon: LocalShippingIcon,
    title: 'Fast delivery',
    subtitle: 'Start from $10',
  },
  { icon: PaymentIcon, title: 'Payment', subtitle: 'Secure system' },
];

export const LINKS = [
  { to: '/', label: 'Home', icon: HomeIcon },
  { to: '/user', label: 'Profile', icon: AccountCircleIcon },
  { to: '/user/orders', label: 'Orders', icon: HistoryIcon },
  { to: '/user/my-favourites', label: 'Favourites', icon: StarIcon },
  {
    action: 'logout',
    label: 'Logout',
    icon: ExitToAppIcon,
  },
];

export const RATINGS = [
  { value: 0, label: 'All' },
  { value: 1, label: '1 ★' },
  { value: 2, label: '2 ★' },
  { value: 3, label: '3 ★' },
  { value: 4, label: '4 ★' },
  { value: 5, label: '5 ★' },
];
