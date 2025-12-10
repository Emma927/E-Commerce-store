import { NavLink } from 'react-router-dom';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '@/store/authSlice';

// Ikony Material UI
// import HomeIcon from '@mui/icons-material/Home'; // <- ikona domu
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';
// import PaymentIcon from '@mui/icons-material/Payment';
// import StarIcon from '@mui/icons-material/Star';
// import HistoryIcon from '@mui/icons-material/History';
// import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { LINKS } from '@/constants';

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleClick = (action) => {
    if (action === 'logout') {
      dispatch(logout());
      navigate('/');
    }
  };

  return (
    <List sx={{ display: { xs: 'flex' }, flexDirection: { md: 'column' } }}>
      {LINKS.map(({ label, icon: Icon, to, action }) => (
        // 'action' będzie undefined dla linków bez akcji, np. Home, Profile
        <ListItem key={label} disablePadding>
          {to ? (
            <ListItemButton
              component={NavLink}
              to={to}
              end={to === '/' || to === '/dashboard'} // Home i Profile mają end
              // Dla NavLink, jeśli end jest ustawione, link będzie aktywny tylko wtedy, gdy aktualna ścieżka dokładnie pasuje do to.
              sx={{
                gap: 1,
                justifyContent: { xs: 'center' },
                flexDirection: { xs: 'column', md: 'row' },
                alignSelf: 'flex-start', // konieczne w Grid, żeby sticky się aktywowało
                '&.active': {
                  backgroundColor: 'primary.main',
                  color: 'primary.contrastText',
                  '& .MuiListItemIcon-root': {
                    color: 'primary.contrastText', // ikona też zmieni kolor
                  },
                },
              }}
            >
              {Icon && (
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    '&.active': {
                      backgroundColor: 'primary.main',
                      color: 'primary.contrastText',
                    },
                  }}
                >
                  <Icon />
                </ListItemIcon>
              )}
              <ListItemText
                primary={label}
                primaryTypographyProps={{
                  fontSize: { xs: '14px', md: '16px' },
                }}
                sx={{
                  display: { xs: 'none', xsm: 'block' }, // <400px tylko ikona
                }}
              />
            </ListItemButton>
          ) : (
            <ListItemButton
              sx={{ gap: 1, justifyContent: { xs: 'center' }, flexDirection: { xs: 'column', md: 'row' } }}
              onClick={() => handleClick(action)}
            >
              {Icon && (
                <ListItemIcon sx={{ minWidth: 0 }}>
                  <Icon />
                </ListItemIcon>
              )}
              <ListItemText
                primary={label}
                primaryTypographyProps={{
                  fontSize: { xs: '14px', md: '16px' },
                }}
                sx={{
                  display: { xs: 'none', xsm: 'block' }, // <400px tylko ikona
                }}
              />
            </ListItemButton>
          )}
        </ListItem>
      ))}
    </List>
  );
};

export default Sidebar;
