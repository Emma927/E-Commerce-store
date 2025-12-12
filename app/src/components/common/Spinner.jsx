import { Box, CircularProgress } from '@mui/material';

export const Spinner = () => {
  return (
    <Box
      data-testid="spinner" // identyfikator do testów
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '3rem 0',
      }}
    >
      <CircularProgress size={60} />
    </Box>
  );
};
