import { useEffect, useState, useMemo, useCallback } from 'react';
import { Box, Grid, Typography, MenuItem, Select, FormControl, InputLabel, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useIntersection } from '@mantine/hooks';
import { useProductsInfinite } from '@/hooks/useProductsInfinite';
import { ProductCard } from '@/components/common/ProductCard';
import { Spinner } from '@/components/common/Spinner';
import { useCategories } from '@/hooks/useCategories';
import { useSelector, useDispatch } from 'react-redux';
import {
  setCategory,
  setSortOrder,
  setSearchQuery,
  setRatingQuery,
  selectCategory,
  selectSortOrder,
  selectSearchQuery,
  selectRatingQuery,
  resetFilters,
} from '@/store/filtersSlice';
import TextField from '@mui/material/TextField';
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { PAGE_SIZE, CAPITALIZE, RATINGS } from '@/constants';
import { FiltersDrawer } from '@/components/common/FiltersDrawer';
import { ScrollToTopButton } from '@/components/common/ScrollToTopButton';
/**
 System wyszukiwania został zrealizowany z wykorzystaniem asynchronicznych zapytań HTTP i lokalnej filtracji. Wprowadzono debounce, aby uniknąć zbędnych wywołań sieciowych i poprawić wydajność. Wyszukiwarka wspiera filtrowanie po kategoriach, sortowanie oraz pełnotekstowe wyszukiwanie. Wszystkie filtry są synchronizowane z parametrami URL, dzięki czemu stan aplikacji pozostaje spójny po przeładowaniu strony.
 */

/**
 * Komponent Products
 *
 * Optymalizacje zastosowane w tym komponencie:
 * 1. useMemo dla allProducts – spłaszcza wszystkie strony produktów tylko wtedy,
 *    gdy zmienia się wynik zapytania (data?.pages), zapobiegając niepotrzebnym obliczeniom przy każdym renderze.
 * 2️. useMemo dla filteredProducts i sortedProducts – filtracja po wyszukiwarce i sortowanie odbywają się
 *    tylko wtedy, gdy zmieniają się dane, debouncedSearch lub sortOrder.
 * 3️. useCallback dla handlerów filtrów – funkcje do zmiany kategorii, sortowania i wyszukiwania nie są
 *    tworzone od nowa przy każdym renderze, co zmniejsza liczbę niepotrzebnych renderów dzieci.
 * 4️. Synchronizacja z URL – filtry są zapisane w URL i Redux, co pozwala na przywrócenie stanu po odświeżeniu strony.
 *
 * Dzięki temu komponent jest bardziej wydajny, mniej renderuje i obsługuje dużą liczbę produktów płynnie.
 */
const Products = () => {
  const theme = useTheme();
  const { data: categories = [] } = useCategories();
  const dispatch = useDispatch();

  // Pobranie filtrów z redux
  const selectedCategory = useSelector(selectCategory);
  const sortOrder = useSelector(selectSortOrder);
  const searchQuery = useSelector(selectSearchQuery);
  const selectedRating = useSelector(selectRatingQuery);

  const debouncedSearch = useDebounce(searchQuery, 400); // Tutaj useQuery otrzymuje wartość ze stanu RTK czyli wartość, albo pusty string przy resecie

  // Dodanie do synchronizacji URL filtrów ze stanem RTK:
  const [searchParams, setSearchParams] = useSearchParams();

  // const currentPage = useSelector(selectCurrentPage);
  const queryClient = useQueryClient(); // usunac???

  const [drawerOpen, setDrawerOpen] = useState(false);

  // a) Pobieranie parametrów z URL przy mount:
  useEffect(() => {
    const categoryFromUrl = searchParams.get('category') || 'all';
    const sortFromUrl = searchParams.get('sort') || 'asc';
    const searchFromUrl = searchParams.get('search') || ''; // dodatkowo url po wpisanym słowie
    const ratingFromUrl = Number(searchParams.get('rating')) || 0; // default "All" = 0

    dispatch(setCategory(categoryFromUrl));
    dispatch(setSortOrder(sortFromUrl));
    dispatch(setSearchQuery(searchFromUrl));
    dispatch(setRatingQuery(ratingFromUrl));
  }, [dispatch, searchParams]);

  // b) Aktualizacja URL przy zmianach filtrów lub page:
  useEffect(() => {
    const params = {};
    if (selectedCategory) params.category = selectedCategory;
    if (sortOrder) params.sort = sortOrder;
    if (debouncedSearch) params.search = debouncedSearch; // dodatkowo url po wpisanym słowie
    if (selectedRating) params.rating = selectedRating;

    setSearchParams(params, { replace: true }); // bo przy normalnej zmianie filtrów nie chcemy tworzyć historii, historia ma być tylko dla url akcji użytkownika, nie przy każdej aktualizacji redux
  }, [selectedCategory, sortOrder, debouncedSearch, setSearchParams, selectedRating]);

  /** Następuje “wysłanie zapytania” w reakcji na zmianę filtra.
 Po lewej stronie (const { data, isPending, ... } =) – to dane i statusy, które hook zwraca do komponentu.

Po prawej stronie (argumenty useProductsInfinite({ category: selectedCategory, sort: sortOrder, pageSize: PAGE_SIZE })) – to parametry wejściowe, czyli to, co hook wykorzysta do wykonania zapytania (fetchProductsInfinite).
 */
  const { data, isPending, isError, error, fetchNextPage, isFetchingNextPage, hasNextPage } = useProductsInfinite({
    category: selectedCategory,
    sort: sortOrder,
    pageSize: PAGE_SIZE,
  });

  /**
  useProductsInfinite zwraca dane stronicowane – czyli data.pages to tablica tablic,
  gdzie każda podtablica to jedna strona produktów. Aby łatwo filtrować i sortować wszystkie produkty na raz,
  potrzebujemy jednej, płaskiej tablicy zamiast tablicy tablic, którą uzyskujemy za pomocą funkcji flat().
  Cała operacja jest opakowana w useMemo, żeby spłaszczenie wykonywało się tylko wtedy,
  gdy zmieniają się dane (data.pages), co poprawia wydajność.
  */
  const allProducts = useMemo(() => {
    const pages = data?.pages ?? []; // Nullish Coalescing - zwraca value jeśli nie jest null ani undefined
    return pages.flat(); // albo zamiast flat() const allProducts = pages.reduce((acc, page) => acc.concat(page), []);
  }, [data?.pages]); // ?. – Optional Chaining - Używany do bezpiecznego dostępu do właściwości obiektu. Jeśli obj jest null lub undefined, nie wyrzuca błędu, tylko zwraca undefined.

  /** Intersection Observer do infinite scroll – BEZ autoscrolla, który po dojściu do końca kontenera powoduje przesunięcie strony na początek
    * useIntersection - hook do wykrywania, kiedy element wchodzi do widoku (Intersection Observer)
    * Zwraca: ref do elementu i entry z informacjami o widoczności (isIntersecting, intersectionRatio itp.)
      Parametry:
    * root = null (viewport) element, w którym obserwujemy widoczność, threshold = 1 (cały element widoczny), procent widoczności elementu wymagany do triggera
    * 0 = nawet 1px widoczny wywoła observer
    * 1 = cały element musi być widoczny
      Użycie w infinite scroll: jeśli entry?.isIntersecting → fetchNextPage()
  */
  const { ref: sentinelRef, entry } = useIntersection({
    root: null,
    threshold: 1,
  });

  // entry?.isIntersecting - sprawdza, czy obserwowany element (sentinelRef) wchodzi w obszar widoczny viewportu.
  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage, hasNextPage]);

  // Reset listy + scroll na górę przy zmianie filtrów
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedCategory, sortOrder, debouncedSearch]);

  /**
  * Dlaczego to działa lepiej?
    * Po reset URL zmienia się queryKey
    * Po resetQueries kasuje stare strony (stary infinite scroll)
    * Po invalidateQueries pobiera nowy start (pierwszą stronę)
Bez tych czynności mogłeś mieć taki problem:
reset filtrów → lista zostaje pusta, bo React Query patrzy na stare strony
infinite scroll zaczyna dopiero przy ładowaniu następnych danych
    *To właśnie rozwiązuje resetQueries + invalidateQueries.
   */
  // Reset filtrów + URL
  const handleReset = () => {
    // 1. Wyczyszczenie Redux
    dispatch(resetFilters()); // reset Redux
    // 2. Reset URL
    setSearchParams({ category: 'all', sort: 'asc', search: '', rating: 0 }, { replace: true });
    // 3. Reset i refetch React Query
    queryClient.resetQueries({ queryKey: ['products-infinite'], exact: false }); // Czyści,  po resetQueries kasuje stare strony (stary infinite scroll)
    queryClient.invalidateQueries({ queryKey: ['products-infinite'], exact: false }); // fetch od nowa, po invalidateQueries pobiera nowy start (pierwszą stronę)
    // 4. Scroll na górę
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filtracja lokalna po wyszukiwarce z debouncem, nie trzeba już sortować, ponieważ fetchProductsInfinite już zwraca produkty w odpowiednim porządku. Zostaje tylko filtracja po debouncedSearch oraz selectedRaiting:
  const filteredProducts = useMemo(
    () =>
      allProducts
        .filter((product) => product.title.toLowerCase().includes(debouncedSearch.toLowerCase()))
        // Operator ? : zwraca wtedy true → czyli wszystkie produkty przechodzą przez filtr, bo true zawsze pozwala elementowi zostać w tablicy.
        // Jeśli selectedRating > 0 → wtedy filtr sprawdza, czy Math.round(product.rating?.rate) === selectedRating.
        .filter((product) => (selectedRating === 0 ? true : Math.round(product.rating?.rate) === selectedRating)),
    [allProducts, debouncedSearch, selectedRating]
  );

  const handleCategoryChange = useCallback((value) => dispatch(setCategory(value)), [dispatch]);
  const handleSortChange = useCallback((value) => dispatch(setSortOrder(value)), [dispatch]);
  const handleSearchChange = useCallback((value) => dispatch(setSearchQuery(value)), [dispatch]);
  const handleRatingChange = useCallback((value) => dispatch(setRatingQuery(value)), [dispatch]);

  if (isPending) return <Spinner />;
  if (isError)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <Typography color="error">{error?.message || 'Cannot get the products.'}</Typography>
      </Box>
    );

  if (!allProducts.length)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <Typography>No products to view.</Typography>
      </Box>
    );

  return (
    <Box sx={{ mt: { md: '115px' } }}>
      {/* HEADER FIXED */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          justifyContent: 'center',
          position: { md: 'fixed' },
          top: '90px',
          left: 0,
          width: '100%',
          zIndex: 30,
          height: { md: '110px' },
          pt: 2,
          pb: 2,
          backgroundColor: theme.palette.background.default,
        }}
      >
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
          <FormControl>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              label="Category"
              sx={{ minWidth: 150 }}
              id="category-select"
              name="category"
            >
              <MenuItem value="all">All</MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {CAPITALIZE(cat)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel>Sort</InputLabel>
            <Select
              value={sortOrder}
              onChange={(e) => handleSortChange(e.target.value)}
              label="Sort"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="asc">Price: Low → High</MenuItem>
              <MenuItem value="desc">Price: High → Low</MenuItem>
            </Select>
          </FormControl>

          {/* Wyszukiwarka */}
          <TextField
            label="Search"
            id="search-products"
            name="search"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            sx={{ minWidth: 180 }}
          />

          <FormControl>
            <InputLabel>Rating</InputLabel>
            <Select
              value={selectedRating}
              onChange={(e) => handleRatingChange(e.target.value)}
              label="Rating"
              sx={{ minWidth: 120 }}
            >
              {RATINGS.map((rating) => (
                <MenuItem key={rating.label} value={rating.value}>
                  {rating.value === 0 ? 'All' : `${rating.value} ★`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button variant="contained" color="secondary" onClick={handleReset} sx={{ ml: 2 }}>
            Reset
          </Button>
        </Box>
      </Box>

      {/* Mobile filters button */}
      <Box
        sx={{
          display: { xs: 'flex', md: 'none' },
          justifyContent: 'flex-end',
          width: '100%',
          position: 'fixed',
          top: '40vh',
          left: 0,
          zIndex: 35,
        }}
      >
        <Button variant="contained" onClick={() => setDrawerOpen(true)}>
          Filters
        </Button>
      </Box>

      {/* Drawer mobile */}
      <FiltersDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        categories={categories}
        selectedCategory={selectedCategory}
        sortOrder={sortOrder}
        selectedRating={selectedRating}
        searchQuery={searchQuery}
        onCategoryChange={handleCategoryChange}
        onSortChange={handleSortChange}
        onRatingChange={handleRatingChange}
        onSearchChange={handleSearchChange}
        onReset={handleReset}
      />

      {/* NO RESULTS SECTION */}
      {/* Brak produktów w ogóle */}
      {allProducts.length === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
          <Typography variant="h6">No products to view.</Typography>
        </Box>
      )}

      {/* Brak produktów po wyszukiwarce */}
      {allProducts.length > 0 && filteredProducts.length === 0 && debouncedSearch && selectedRating === 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
          <Typography variant="h6">No products match your search.</Typography>
          <Typography variant="subtitle1" color="error" sx={{ fontWeight: 'bold', mb: 3 }}>
            “{debouncedSearch}”
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.7 }}>
            Try using different keywords.
          </Typography>
        </Box>
      )}

      {/* Brak produktów po filtrze rating */}
      {allProducts.length > 0 && filteredProducts.length === 0 && selectedRating > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', mt: 4 }}>
          <Typography variant="h6">No rating on this scale.</Typography>
        </Box>
      )}

      {/* LISTA PRODUKTÓW */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {filteredProducts.map((product) => (
          <Grid item key={product.id} xs={12} md={6} lg={4}>
            <ProductCard {...product} />
          </Grid>
        ))}
      </Grid>

      {/* Sentinel do infinite scroll */}
      <div ref={sentinelRef} style={{ height: 1 }} />

      {/* Loader */}
      {isFetchingNextPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Spinner />
        </Box>
      )}
      <ScrollToTopButton />
    </Box>
  );
};

export default Products;