import { Outlet } from 'react-router-dom';
import { Grid } from '@mui/material';
import Sidebar from '@/components/sections/Sidebar';

const Dashboard = () => {
  return (
    <Grid container direction={{ xs: 'column', md: 'row' }}>
      {/* Sidebar */}
      <Grid
        size={{ xs: 12, md: 4 }}
        sx={{
          p: { xs: 0, md: 2 },
          position: { xs: 'fixed', md: 'sticky' },
          top: { xs: 'auto', md: '90px' }, // desktop: przyklejony od góry
          bottom: { xs: 0, md: 'auto' }, // mobile: przyklejony od dołu
          left: 0, // na mobile przylega do lewej krawędzi
          zIndex: 10,
          borderTop: { xs: '1px solid #ccc', md: 'none' }, // mobile tylko górny border
          height: { xs: '110px', md: 'fit-content' }, // ważne dla sticky
          backgroundColor: 'background.default', // żeby nie było przezroczyste,
          display: 'flex',
          flexDirection: 'column', // ułożenie dzieci w kolumnie
          justifyContent: 'center', // pionowe wyśrodkowanie
        }}
      >
        <Sidebar />
      </Grid>

      {/* Główny content */}
      <Grid size={{ xs: 12, md: 8 }} pt={1} pl={{ xs: 0, md: 3 }}>
        <Outlet />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
