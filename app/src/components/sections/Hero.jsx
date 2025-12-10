import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

const HeroBox = styled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2, 0),
  overflow: 'hidden',
}));

// Stała wysokość i object-fit: cover dla wszystkich zdjęć
const HeroImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 200, // wszystkie zdjęcia tej samej wysokości
  objectFit: 'cover', // przycinanie jeśli trzeba, zachowuje proporcje
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
}));

const Hero = ({ 'data-testid': dataTestId }) => {
  return (
    <HeroBox data-testid={dataTestId}>
      <Grid container spacing={2} alignItems="center">
        {/* Lewa kolumna */}
        <Grid item xs={12} md={5}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <HeroImage src="ecommerce1.webp" alt="E-Commerce Hero 1" loading="lazy" />
            </Grid>
            <Grid item>
              <HeroImage src="ecommerce2.webp" alt="E-Commerce Hero 2" loading="lazy" />
            </Grid>
          </Grid>
        </Grid>

        {/* Środkowe kółko */}
        <Grid
          item
          xs={12}
          md={2}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: 18,
            }}
          >
            E-Commerce
          </Box>
        </Grid>

        {/* Prawa kolumna */}
        <Grid item xs={12} md={5}>
          <Grid container spacing={2} direction="column">
            <Grid item>
              <HeroImage src="ecommerce3.webp" alt="E-Commerce Hero 3" loading="lazy" />
            </Grid>
            <Grid item>
              <HeroImage src="ecommerce4.webp" alt="E-Commerce Hero 4" loading="lazy" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </HeroBox>
  );
};

export default Hero;