import { Box, Grid, Typography } from '@mui/material';
import { FEATURES } from '@/constants';

export const FeatureBar = () => {
  return (
    <Box sx={{ py: 5, bgcolor: 'grey.400', mt: 2 }}>
      <Grid container spacing={4} justifyContent="center" alignItems="center">
        {FEATURES.map(({ icon: Icon, title, subtitle }, index) => (
          <Grid
            key={index}
            size={{ xs: 12, sm: 4 }}
            sx={{
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 1,
            }}
          >
            <Icon fontSize="large" />
            <Typography variant="h6" fontWeight="bold">
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
