import { Drawer, Box, Typography, Button } from '@mui/material';
import { Filters } from './Filters';

export const FiltersDrawer = ({ open, onClose, ...props }) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box
        sx={{
          width: 280,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
        }}
      >
        <Typography variant="h6">Filters</Typography>

        <Filters {...props} />

        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </Box>
    </Drawer>
  );
};
