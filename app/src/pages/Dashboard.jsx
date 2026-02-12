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
          // height: fit-content - w MUI Grid kolumny mają domyślnie align-items: stretch
          // bez fit-content sidebar byłby rozciągnięty na całą wysokość rodzica
          // sticky nie miałby miejsca do przyklejenia → efekt sticky nie działałby
          position: { xs: 'fixed', md: 'sticky' },
          top: { xs: 'auto', md: '90px' },
          bottom: { xs: 0, md: 'auto' },
          left: 0,
          zIndex: 10,
          borderTop: { xs: '1px solid #ccc', md: 'none' },
          height: { xs: '110px', md: 'fit-content' }, // ważne dla sticky
          backgroundColor: 'background.default', // zapewnia tło nieprzezroczyste
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
