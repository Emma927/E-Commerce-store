import { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '@/store/authSlice';
import { Box, Typography, Button } from '@mui/material';
import { Spinner } from '@/components/common/Spinner';
import { useUser } from '@/hooks/useUser';
import { CAPITALIZE } from '@/constants';
import { CAPITALIZE_WORDS } from '@/constants';

// Fake Store API (https://fakestoreapi.com) NIE ZWRACA użytkownika po tokenie JWT. Nie dostaniemy ID użytkownika, ani jego pełnych danych po samym logowaniu.
const Profile = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // pobiera userId po username (enndpoint auth ma tylko username i password) → potem pobiera usera po userId (endpoint users może już pobierać po id)
  const { data: user, isPending, isError } = useUser();

  const [show, setShow] = useState(false);

  if (isPending) return <Spinner />;
  if (isError) return <p>Error loading profile</p>;

  // Jeśli nie ma tokena lub nie udało się pobrać usera
  if (!isAuthenticated || !user) {
    return (
      <Box sx={{ mt: { xs: 0, md: 5 } }} textAlign="center">
        <Typography variant="h6">You are not logged in.</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        mb: { xs: '20px', md: 0 },
      }}
    >
      <Typography variant="h4">Profile: {user.username}</Typography>
      <Typography>ID: {user.id}</Typography>
      <Typography>Email: {user.email}</Typography>
      <Typography>Phone: {user.phone}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <Typography sx={{ minWidth: '180px' }}>
          Password: {show ? user.password : '*****'}
        </Typography>
        <Button variant="outlined" size="small" onClick={() => setShow(!show)}>
          {show ? 'Hide' : 'Show'}
        </Button>
      </Box>
      <Typography variant="h6" mt={2}>
        Name:
      </Typography>
      <Typography>First: {CAPITALIZE(user.name.firstname)}</Typography>
      <Typography>Last: {CAPITALIZE(user.name.lastname)}</Typography>

      <Typography variant="h6" mt={2}>
        Address:
      </Typography>
      <Typography>
        {CAPITALIZE_WORDS(user.address.street)} {user.address.number},{' '}
        {CAPITALIZE(user.address.city)}, {user.address.zipcode}
      </Typography>
      <Typography>
        {/* Wyrazy lat i long to skróty od latitude i longitude, czyli szerokości i długości geograficznej. */}
        Geolocation: lat {user.address.geolocation.lat}, long{' '}
        {user.address.geolocation.long}
      </Typography>
    </Box>
  );
};

export default Profile;
