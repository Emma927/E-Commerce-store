import { Outlet } from 'react-router-dom';
import { Container, styled } from '@mui/material';
import Navigation from '@/components/sections/Navigation';
import Footer from '@/components/sections/Footer';

const Main = styled('main')({
  flexGrow: 1,
  marginTop: '6.875rem',
  marginBottom: '3.125rem',
});

const Layout = () => {
  return (
    <>
      <Navigation />
      <Main>
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Main>
      <Footer />
    </>
  );
};

export default Layout;
