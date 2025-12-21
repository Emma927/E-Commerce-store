import { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Box, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { selectUsername, selectIsAuthenticated } from '@/store/authSlice';
import StoreIcon from '@mui/icons-material/Store';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import MenuIcon from '@mui/icons-material/Menu';
import { Container } from '@mui/material';
import { ThemeToggleButton } from '@/components/common/ThemeToggleButton';
import StarIcon from '@mui/icons-material/Star';
import Badge from '@mui/material/Badge';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCartTotalItems } from '@/store/cartSlice';
import { selectFavouritesCount } from '@/store/favouritesSlice';
import { NavigationDrawer } from '@/components/common/NavigationDrawer';

// styled w MUI (Material-UI) to funkcja do tworzenia komponentów z własnymi stylami, która pozwala pisać CSS w JavaScript w bardzo wygodny sposób. W praktyce jest to wygodniejsza i mocniejsza alternatywa dla inline styles lub klasycznych CSS.
const StyledNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: 'none',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  '&:hover': {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
  '&.active': { color: theme.palette.primary.main, fontWeight: 'bold' },
}));

const Navigation = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const pendingPathRef = useRef(null); // referencja do ścieżki, aby nie używać dodatkowego stanu
  // const [nextPath, setNextPath] = useState(null);
  const username = useSelector(selectUsername);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const cartCount = useSelector(selectCartTotalItems);

  const favouritesCount = useSelector(selectFavouritesCount);

  // // Funkcja zamykająca Drawer i resetująca kategorie
  // const handleNavigate = (path) => {
  //   // Drawer zostaje zamknięty (drawerOpen = false) i animacja kończy się naturalnie.
  //   setDrawerOpen(false); // zamykamy Drawer,
  //   setNextPath(path); // ustawiamy trasę do przejścia
  // };

  // useEffect nasłuchuje na drawerOpen i wywołuje navigate() dopiero, gdy Drawer jest zamknięty, dzięki czemu wszystko działa płynnie.
  // useEffect(() => {
  //   if (!drawerOpen && nextPath) {
  //     navigate(nextPath);
  //     // setNextPath(null) resetuje stan, żeby nie wywoływać navigate() ponownie przy kolejnym renderze.
  //     setNextPath(null);
  //   }
  // }, [drawerOpen, nextPath, navigate]);

  // Funkcja obsługująca kliknięcie linku w Drawer
  const handleNavigate = (path) => {
    pendingPathRef.current = path; // zapisujemy ścieżkę, zapamiętaj dokąd iść
    setDrawerOpen(false); // zamykamy Drawer (animacja), zamknij Drawer (start animacji)
  };

  // Callback wywołany po zakończeniu animacji Drawer (MUI)
  const handleDrawerExited = () => {
    if (pendingPathRef.current) {
      navigate(pendingPathRef.current);
      pendingPathRef.current = null;
    }
  };

  return (
    <>
      {/* AppBar */}
      <AppBar
        position="fixed"
        color="default"
        elevation={1}
        sx={{
          top: 0,
          left: 0,
          height: '90px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Container maxWidth="lg" sx={{ height: '100%' }}>
          <Toolbar
            disableGutters
            sx={{
              height: '100%',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            {/* Logo */}
            <Box
              component={StyledNavLink}
              to="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
                height: '100%',
                fontSize: { xs: '22px', md: '27px' }, // mniejszy na mobile, większy na desktop
                fontWeight: 'bold', // opcjonalnie pogrubienie
                '&:hover': {
                  backgroundColor: 'transparent', // brak podświetlenia
                },
              }}
            >
              E-Commerce store
              <StoreIcon
                sx={{
                  ml: 1,
                  width: { xs: 24, sm: 35 }, // xs = mobile, sm i powyżej = desktop
                  height: { xs: 24, sm: 35 },
                }}
              />
            </Box>

            {/* Desktop menu */}
            <Box
              sx={{
                display: { xs: 'none', md: 'flex', height: '100%' },
                alignItems: 'center',
                gap: 2.5,
              }}
            >
              <Button
                color="inherit"
                component={StyledNavLink}
                to="/products"
                sx={{ fontSize: { md: '16px' } }}
              >
                Products
              </Button>
              {/* Stałe linki */}
              <Button
                color="inherit"
                to="/cart"
                component={StyledNavLink}
                sx={{
                  height: '100%', // pełna wysokość rodzica
                  display: 'flex', // żeby wewnątrz ikonki było wyśrodkowane
                  alignItems: 'center', // pionowe wyśrodkowanie
                  color: 'inherit', // domyślny kolor
                }}
              >
                {/* Operator ?? w JavaScript to nullish coalescing operator – zwraca wartość po lewej stronie, chyba że jest null lub undefined, wtedy zwraca wartość po prawej stronie. */}
                <Badge badgeContent={cartCount ?? undefined} color="primary">
                  <ShoppingCartIcon sx={{ fontSize: { md: '25px' } }} />
                </Badge>
              </Button>
              <Button
                color="inherit"
                component={StyledNavLink}
                to="/favourites"
                sx={{
                  height: '100%', // pełna wysokość Toolbara
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Badge
                  badgeContent={favouritesCount ?? undefined}
                  color="primary"
                >
                  <StarIcon sx={{ fontSize: { md: '25px' } }} />
                </Badge>
              </Button>
              {!isAuthenticated ? (
                // kiedy NIE zalogowany → pokazujemy Login
                <Button color="inherit" component={StyledNavLink} to="/login">
                  Login
                </Button>
              ) : (
                // kiedy zalogowany → pokazujemy username
                <Button
                  color="inherit"
                  component={StyledNavLink}
                  to="/dashboard"
                  sx={{ fontSize: { md: '16px' } }}
                >
                  {username}
                </Button>
              )}
              <ThemeToggleButton />
            </Box>

            {/* Mobile hamburger */}
            <Box
              sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center' }}
            >
              <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
                <MenuIcon sx={{ fontSize: { xs: '22px', xsm: '30px' } }} />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* NavigationDrawer na mobile */}
      <NavigationDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        handleNavigate={handleNavigate}
        onExited={handleDrawerExited} // <- tutaj płynna nawigacja po animacji
        cartCount={cartCount}
        favouritesCount={favouritesCount}
        isAuthenticated={isAuthenticated}
        username={username}
        currentPath={location.pathname}
      />
    </>
  );
};

export default Navigation;
