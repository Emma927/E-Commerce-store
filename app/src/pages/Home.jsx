import Hero from '@/components/sections/Hero';
import { ProductCard } from '@/components/common/ProductCard';
import { Box, Grid, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Spinner } from '@/components/common/Spinner';
import { useCategories } from '@/hooks/useCategories';
import { fetchProducts } from '@/hooks/useProducts';
import { useQueries } from '@tanstack/react-query';
import { ScrollToTopButton } from '@/components/common/ScrollToTopButton';
import { CAPITALIZE_WORDS } from '@/constants';
import { FeatureBar } from '@/components/common/FeatureBar';
import { keyframes } from '@mui/system';

const Home = () => {
  const { data: categories = [], isPending, isError } = useCategories();
  const theme = useTheme();
  // Trzeba pobrać produkty dla każdej kategorii osobno. Nie ma gotowego hooka dla „wszystkich kategorii na raz”. Dlatego używa się productsQueries
  // Wywołujemy hooki dla produktów wszystkich kategorii na raz
  // Można dalej korzystać z useProducts tylko wtedy, gdy fetchujemy produkty dla jednej, stałej kategorii.
  const productsQueries = useQueries({
    // queries nie jest tablicą sama w sobie, tylko kluczem w obiekcie przekazywanym do useQueries, który musi zawierać tablicę obiektów query.
    queries: categories.map((category) => ({
      queryKey: ['products', category],
      queryFn: () => fetchProducts({ category, limit: 20 }),
      staleTime: 1000 * 60 * 5, // 5 minut – dane są uważane za „świeże”, dopóki nie minie ten czas, brak refetch przy mountowaniu
      cacheTime: 1000 * 60 * 10, // 10 minut – dane pozostają w pamięci po odmontowaniu komponentu, potem zostaną usunięte
      retry: 1, // maksymalnie 1 ponowna próba fetch w przypadku błędu (łącznie 2 próby)
    })),
  });

  // Pokazujemy spinner dopóki dane nie są gotowe:
  // - isPending → kategorie wciąż się ładują
  // - productsQueries.some(q => q.isPending) → produkty dla którejkolwiek kategorii wciąż się ładują
  if (isPending || productsQueries.some((q) => q.isPending)) {
    return <Spinner />;
  }

  // Jeśli którykolwiek fetch produktów lub hook useCategories() zwróci błąd,
  // pokazujemy go inline (Typography), a nie jako toast.
  // Dlaczego? useQueries pobiera produkty dla wielu kategorii równocześnie.
  // Toasty dla każdego fetcha mogłyby dać wiele powiadomień naraz → złe UX.
  // Inline error daje czytelny komunikat w miejscu komponentu.
  if (isError || productsQueries.some((q) => q.isError)) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <Typography color="error">Error while loading.</Typography>
      </Box>
    );
  }

  if (!categories.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <Typography>No categories to view.</Typography>
      </Box>
    );
  }

  const marquee = keyframes`
  0% { transform: translateX(0%); }
  100% { transform: translateX(-100%); }
`;

  return (
    <Box>
      {/* <Hero data-testid="hero" /> identyfikator do testów */}
      <Hero /> {/* identyfikator do testów */}
      <FeatureBar />
      <Box
        sx={{
          overflow: 'hidden', // ukrywa nadmiar tekstu
          whiteSpace: 'nowrap', // tekst w jednej linii
          bgcolor: 'primary.main',
          color: 'white',
          borderRadius: 2,
          fontSize: 25,
          py: 2,
          mt: 5,
          mb: { xs: 5, md: 5 },
        }}
      >
        <Box
          component="span"
          sx={{
            display: 'inline-block',
            paddingLeft: '100%', // start poza ekranem
            animation: `${marquee} 10s linear infinite`,
            color: theme.palette.info,
          }}
        >
          Our top picks for You!
        </Box>
      </Box>
      {categories.map((category, index) => {
        const products = productsQueries[index].data || []; // productsQueries[index] – wybieramy wynik dla konkretnej kategorii (indeks z categories.map).

        // --- Top 3 po ratingu ---
        const topProducts = products
          .sort((a, b) => b.rating.rate - a.rating.rate)
          .slice(0, 3);

        return (
          <Box
            key={category}
            id={category}
            sx={{
              mt: 5,
              scrollMarginTop: '120px', // offset dla fixed navbaru
            }}
            // data-testid={`category-${category.id}`}
          >
            <Typography variant="h5" sx={{ mb: 2 }}>
              {CAPITALIZE_WORDS(category)}
            </Typography>
            <Grid container spacing={2} marginBottom={3}>
              {topProducts.length ? (
                topProducts.map((product) => (
                  <Grid key={product.id} size={{ xs: 12, md: 6, lg: 4 }}>
                    <ProductCard {...product} />
                  </Grid>
                ))
              ) : (
                <Typography sx={{ m: 2 }}>
                  No products in this category.
                </Typography>
              )}
            </Grid>
            <ScrollToTopButton />
          </Box>
        );
      })}
    </Box>
  );
};

export default Home;
