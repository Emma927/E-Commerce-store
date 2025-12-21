import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Badge,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import { ThemeToggleButton } from '@/components/common/ThemeToggleButton';

// Styled component dla przycisków w Drawer
const DrawerNavButton = styled(ListItemButton, {
  shouldForwardProp: (prop) => prop !== 'active',
})(({ theme, active }) => ({
  color: active ? theme.palette.primary.main : theme.palette.text.primary,
  fontWeight: active ? 'bold' : 'normal',
  paddingTop: '16px',
  paddingBottom: '16px',
  '&:hover': {
    color: theme.palette.primary.light,
    backgroundColor: theme.palette.action.hover,
  },
}));

export const NavigationDrawer = ({
  open,
  onClose,
  handleNavigate,
  cartCount,
  favouritesCount,
  isAuthenticated,
  username,
  currentPath,
  onExited, // <-- dodaj prop onExited
}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      // Nowoczesne podejście slotowe
      slotProps={{
        transition: {
          onExited: onExited, // callback wywołany po zakończeniu animacjico ten callback robi?
        },
      }}
    >
      <List sx={{ width: 250, py: 2 }}>
        {/* Products */}
        <ListItem disablePadding>
          <DrawerNavButton
            onClick={() => handleNavigate('/products')}
            active={currentPath === '/products'}
          >
            <ListItemText primary="Products" />
          </DrawerNavButton>
        </ListItem>

        {/* Cart */}
        <ListItem disablePadding>
          <DrawerNavButton
            onClick={() => handleNavigate('/cart')}
            active={currentPath === '/cart'}
          >
            {/* W skrócie: nie warto tu dodawać memo ani useCallback tylko dla samego Drawer, bo Badge i tak musi się aktualizować */}
            <Badge badgeContent={cartCount ?? undefined} color="primary">
              <ShoppingCartIcon />
            </Badge>
          </DrawerNavButton>
        </ListItem>

        {/* Favourites */}
        <ListItem disablePadding>
          <DrawerNavButton
            onClick={() => handleNavigate('/favourites')}
            active={currentPath === '/favourites'}
            sx={{ color: 'text.primary' }}
          >
            <Badge badgeContent={favouritesCount ?? undefined} color="primary">
              <StarIcon
                color={currentPath === '/favourites' ? 'primary' : 'inherit'}
              />
            </Badge>
          </DrawerNavButton>
        </ListItem>

        {/* Login / Dashboard */}
        <ListItem disablePadding>
          {!isAuthenticated ? (
            <DrawerNavButton
              onClick={() => handleNavigate('/login')}
              active={currentPath === '/login'}
            >
              <ListItemText primary="Login" />
            </DrawerNavButton>
          ) : (
            <DrawerNavButton
              onClick={() => handleNavigate('/dashboard')}
              active={currentPath === '/dashboard'}
            >
              <ListItemText primary={username} />
            </DrawerNavButton>
          )}
        </ListItem>

        {/* Theme toggle */}
        <ListItem disablePadding>
          <ListItemButton onClick={onClose} sx={{ py: '16px' }}>
            <ThemeToggleButton />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );
};
