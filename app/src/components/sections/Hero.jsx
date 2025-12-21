import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';

const HeroImage = styled('img')(({ theme }) => ({
  width: '100%',
  height: 200,
  objectFit: 'cover',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  display: 'block',
}));

const Hero = () => {
  return (
    <Grid container spacing={4} alignItems="center" sx={{ m: 0, py: 3 }}>
      {/* Lewa kolumna */}
      <Grid size={{ xs: 12, md: 5 }}>
        <Grid container spacing={2} direction="column">
          <Grid size={12}>
            <HeroImage
              src="ecommerce1.webp"
              alt="E-Commerce Hero 1"
              loading="lazy"
            />
          </Grid>
          <Grid size={12}>
            <HeroImage
              src="ecommerce2.webp"
              alt="E-Commerce Hero 2"
              loading="lazy"
            />
          </Grid>
        </Grid>
      </Grid>

      {/* Środkowe kółko */}
      <Grid
        size={{ xs: 12, md: 2 }}
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
      <Grid size={{ xs: 12, md: 5 }}>
        <Grid container spacing={2} direction="column">
          <Grid size={12}>
            <HeroImage
              src="ecommerce3.webp"
              alt="E-Commerce Hero 3"
              loading="lazy"
            />
          </Grid>
          <Grid size={12}>
            <HeroImage
              src="ecommerce4.webp"
              alt="E-Commerce Hero 4"
              loading="lazy"
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Hero;
