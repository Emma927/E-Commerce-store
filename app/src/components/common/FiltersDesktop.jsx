import { Box } from '@mui/material';
import { Filters } from './Filters';

export const FiltersDesktop = (props) => {
  return (
    <Box
      sx={{
        display: { xs: 'none', md: 'flex' },
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        flexWrap: 'wrap',
        mx: 3,
      }}
    >
      <Filters {...props} />
    </Box>
  );
};
