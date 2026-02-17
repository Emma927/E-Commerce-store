import { useEffect, useState, useMemo, useCallback } from 'react';
import { Box, Grid, Typography, Button } from '@mui/material';
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
import { useDebounce } from '@/hooks/useDebounce';
import { useSearchParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { PAGE_SIZE } from '@/constants';
import { FiltersDesktop } from '@/components/common/FiltersDesktop';
import { FiltersDrawer } from '@/components/common/FiltersDrawer';
import { ScrollToTopButton } from '@/components/common/ScrollToTopButton';
import { useHandleApiError } from '@/hooks/useHandleApiError';

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

  /**
   * useSearchParams - to hook z React Router do odczytu i aktualizacji query string w URL (?key=value).
Pozwala synchronizować stan aplikacji z adresem przeglądarki.
   * searchParams – odczyt aktualnego URL (query string) w postaci obiektu do manipulacji.
   * setSearchParams(...) – aktualizuje URL w pasku przeglądarki.
   * To jest moment, w którym faktycznie powstaje / zmienia się adres w pasku.
   */
  // Dodanie do synchronizacji URL filtrów ze stanem RTK:
  const [searchParams, setSearchParams] = useSearchParams();

  // Pobieramy istniejący, globalny QueryClient z kontekstu QueryClientProvider React Query.
  // useQueryClient() NIE tworzy nowej instancji (to nie jest new QueryClient()),
  // tylko daje dostęp do tego samego klienta używanego w całej aplikacji,
  // dzięki czemu możemy ręcznie zarządzać cache (resetQueries / invalidateQueries).
  const queryClient = useQueryClient();

  const [drawerOpen, setDrawerOpen] = useState(false);

  /* 
  * Kiedy potrzebny jest useEffect, gdy wykonujemy efekt uboczny, czyli coś poza czystym renderem — np. fetch danych, subskrypcje, synchronizację z URL, manipulację DOM lub reakcję na zmianę zależności.
  🔹 useEffect do synchronizacji Redux ↔ URL został usunięty, ponieważ w obecnym setupie nie jest potrzebny:
    1. initialState w filtersSlice odczytuje URL przy starcie (brak "mrugania").
    2. updateFilters() synchronizuje Redux i URL przy każdej akcji użytkownika (Select, input).
    3. handleReset() poprawnie resetuje Redux, URL i React Query.
  Ten useEffect byłby potrzebny tylko w przypadku dodania zewnętrznych linków (np. w Headerze), które zmieniają URL bez interakcji z Selectami.
*/
  //   useEffect(() => {
  //     const categoryFromUrl = searchParams.get('category') || 'all';
  //     const sortFromUrl = searchParams.get('sort') || 'asc';
  //     const searchFromUrl = searchParams.get('search') || ''; // dodatkowo w url po wpisanym słowie
  //     const ratingFromUrl = Number(searchParams.get('rating')) || 0; // default rating "All" = 0
  //
  //     // ustawienie początkowego stanu w Redux
  //     dispatch(setCategory(categoryFromUrl));
  //     dispatch(setSortOrder(sortFromUrl));
  //     dispatch(setSearchQuery(searchFromUrl));
  //     dispatch(setRatingQuery(ratingFromUrl));
  //   }, [dispatch, searchParams]);
  // --------- FUNKCJA DO AKTUALIZACJI FILTRÓW (Redux + URL) ----------
  const updateFilters = useCallback(
    (updates) => {
      // 1️⃣ Aktualizacja Redux przy zmianie fitlrów
      if (updates.category !== undefined)
        dispatch(setCategory(updates.category));
      if (updates.sort !== undefined) dispatch(setSortOrder(updates.sort));
      if (updates.search !== undefined)
        dispatch(setSearchQuery(updates.search));
      if (updates.rating !== undefined)
        dispatch(setRatingQuery(updates.rating));

      // 2️⃣ Aktualizacja URL przy zmianie filtrów - synchronizacja z redux
      // searchParams to aktualny obiekt parametrów URL zwrócony przez useSearchParams(). Zawiera wszystkie parametry, które są w adresie po ?, np. ?category=electronics&sort=asc
      // Object.fromEntries(searchParams.entries()) – konwertuje te parametry na zwykły obiekt JS, np. { category: 'electronics', sort: 'asc' }
      const newParams = Object.fromEntries(searchParams.entries()); // pobiera aktualne parametry URL i tworzy z nich obiekt JS.
      Object.assign(newParams, updates); // napisanie wartości obiektu newParams tymi z updates, czyli aktualizacja tylko tych, które się zmieniły, np. { category: 'electronics', sort: 'asc', search: 'laptop' }

      // Czyścimy domyślne wartości
      if (newParams.category === 'all') delete newParams.category;
      if (newParams.sort === 'asc') delete newParams.sort;
      if (!newParams.search) delete newParams.search;
      if (Number(newParams.rating) === 0) delete newParams.rating;

      setSearchParams(newParams, { replace: true });
    },
    [dispatch, searchParams, setSearchParams],
  );

  const handleCategoryChange = (e) =>
    updateFilters({ category: e.target.value });
  const handleSortChange = (e) => updateFilters({ sort: e.target.value });
  const handleSearchChange = (e) => updateFilters({ search: e.target.value });
  const handleRatingChange = (e) => {
    const value = Number(e.target.value); // wyciąga wartość i konwertuje na liczbę
    updateFilters({ rating: value });
  };

  // --------- POBIERANIE DANYCH STRONICOWANYCH ----------
  /** Następuje “wysłanie zapytania” w reakcji na zmianę filtra.
 Po lewej stronie (const { data, isPending, ... } =) – to dane i statusy, które hook zwraca do komponentu.

Po prawej stronie (argumenty useProductsInfinite({ category: selectedCategory, sort: sortOrder, pageSize: PAGE_SIZE, search: debouncedSearch, rating: selectedRating })) – to parametry wejściowe, czyli to, co hook wykorzysta do wykonania zapytania (fetchProductsInfinite).
 */
  const {
    data,
    isPending,
    isError,
    error,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useProductsInfinite({
    category: selectedCategory,
    sort: sortOrder,
    pageSize: PAGE_SIZE,
    search: debouncedSearch, // Hook dostaje już zdebouncowaną wartość, więc fetchProductsInfinite będzie wywoływany tylko po 400ms od ostatniego wpisania tekstu w wyszukiwarkę.
    rating: selectedRating, // Hook będzie wyszukiwał produkty po ratingu, ale tylko w pamięci (client-side), bo API tego nie obsługuje. Dodanie rating do queryKey powoduje, że React Query wie, kiedy odświeżyć hook i przeliczyć cache.
  });

  // Tworzymy handler błędów API z użyciem custom hooka.
  // Przekazujemy queryKey (['products-infinite']), który hook wykorzysta tylko w przypadku błędu serwera (status ≥ 500), aby opcjonalnie wywołać refetch danych (queryClient.invalidateQueries) dla tego zapytania.
  const handleApiError = useHandleApiError(['products-infinite']);

  useEffect(() => {
    if (isError) {
      // Gdy wystąpi błąd, przekazujemy obiekt error do hooka.
      handleApiError(error);
    }
  }, [isError, error, handleApiError]);

  /**
  useProductsInfinite zwraca dane stronicowane – czyli data.pages to tablica tablic,
  gdzie każda podtablica to jedna strona produktów. Aby łatwo filtrować i sortować wszystkie produkty na raz,
  potrzebujemy jednej, płaskiej tablicy zamiast tablicy tablic, którą uzyskujemy za pomocą funkcji flat().
  Cała operacja jest opakowana w useMemo, żeby spłaszczenie wykonywało się tylko wtedy,
  gdy zmieniają się dane (data.pages), co poprawia wydajność.

  1️⃣ Przed spłaszczeniem (data.pages)
data.pages = [
  [{id:1, name:'A'}, {id:2, name:'B'}], // strona 0
  [{id:3, name:'C'}, {id:4, name:'D'}]  // strona 1
]

- data.pages[0] → [ {id:1, name:'A'}, {id:2, name:'B'} ]
- data.pages[0][0] → {id:1, name:'A'}

Tablice mają tylko indeksy. name jest w obiekcie wewnątrz tablicy, nie w tablicy.

2️⃣ Po spłaszczeniu (data.pages.flat())
allProducts = data.pages.flat();

- allProducts → [ {id:1,name:'A'}, {id:2,name:'B'}, {id:3,name:'C'}, {id:4,name:'D'} ]

Dostęp:
- allProducts[0] → {id:1,name:'A'}
- allProducts[0].name → 'A'
  */
  const allProducts = useMemo(() => {
    // jesli data = null to dzięki ? nie wyrzuci błędu, tylko zwróci undefined, a dzięki ?? [] zwróci pustą tablicę zamiast undefined, więc flat() będzie działać bez błędu.
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
    // Usuń wszystkie parametry domyślne, aby URL był czysty
    setSearchParams({}, { replace: true });
    // 3. Reset i refetch React Query
    queryClient.resetQueries({ queryKey: ['products-infinite'], exact: false }); // Czyści, po resetQueries kasuje stare strony (stary infinite scroll)
    queryClient.invalidateQueries({
      queryKey: ['products-infinite'],
      exact: false,
    }); // fetch od nowa, po invalidateQueries pobiera nowy start (pierwszą stronę)
    // 4. Scroll na górę
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  /**  Poprawny sposób szukania w cache:
useEffect(() => {
  const query = queryClient.getQueryCache().find({
    predicate: (q) => q.queryKey[0] === 'products-infinite'
  });
  if (query) {
    console.log('Active:', query.isActive());
  } else {
    console.log('Nie znaleziono query w cache');
  }
}, [queryClient]);

 * W queryKey w React Query:
['products-infinite', { category, sort, search }]
[0] → 'products-infinite' → identyfikator query (nazwa)
[1] → { category, sort, search } → parametry, które odróżniają różne wersje tego samego query
Dlatego w predicate piszesz:
predicate: (q) => q.queryKey[0] === 'products-infinite'
Bo chcesz znaleźć wszystkie query typu 'products-infinite', niezależnie od parametrów.
💡 Krótko: [0] w queryKey to nazwa query, [1] i dalej to parametry.
 */

  // Produkty są już przefiltrowane i posortowane w hooku useProductsInfinite.
  // Nie trzeba lokalnie sortować ani filtrować, czy wyszukiwać. Komponent używa tylko allProducts do renderu.

  if (isPending) return <Spinner />;
  if (isError)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
        <Typography color="error">
          Something went wrong. Please try again.
        </Typography>
      </Box>
    );

  // if (!allProducts.length) -NIE POTRZEBA SPRAWDZAĆ PRZED RETURN BO SPRAWDZAM WEWNĄTRZ WYSZUKIWARKI W SEKCJI "NO RESULTS"
  //   return (
  //     <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
  //       <Typography>No products to view.</Typography>
  //     </Box>
  //   );

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
        <FiltersDesktop
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
          idPrefix="desktop"
        />
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
        idPrefix="drawer"
      />

      {/* NO RESULTS SECTION */}
      {!allProducts.length && !isFetchingNextPage && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 4,
          }}
        >
          {debouncedSearch && selectedRating === 0 ? (
            <>
              <Typography variant="h6">
                No products match your search.
              </Typography>
              <Typography
                variant="subtitle1"
                color="error"
                sx={{ fontWeight: 'bold', mb: 3 }}
              >
                “{debouncedSearch}”
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.7 }}>
                Try using different keywords.
              </Typography>
            </>
          ) : selectedRating > 0 ? (
            <Typography variant="h6">No products with this rating.</Typography>
          ) : (
            <Typography variant="h6">No products to view.</Typography>
          )}
        </Box>
      )}

      {/* LISTA PRODUKTÓW */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {allProducts.map((product) => (
          <Grid key={product.id} size={{ xs: 12, md: 6, lg: 4 }}>
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
