import { createSlice, createSelector } from '@reduxjs/toolkit';

// Wczytanie koszyka z localStorage przy starcie aplikacji
// Jeśli nic nie ma w localStorage, używamy pustej tablicy
const savedCart = JSON.parse(localStorage.getItem('cart')) || [];

const initialState = {
  cartProducts: savedCart,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * Dodaje produkt do koszyka.
     * Jeśli produkt już istnieje, zwiększa jego quantity.
     * Jeśli nie istnieje, dodaje nowy obiekt z quantity domyślnym 1.
     * Po każdej zmianie zapisuje stan do localStorage.
     */
    addToCart: (state, action) => {
      const existingProduct = state.cartProducts.find(
        (p) => p.id === action.payload.id,
      );
      // if (existingProduct) – produkt jest już w koszyku → zwiększamy jego quantity o 1.
      if (existingProduct) {
        // jeśli action.payload.quantity jest falsy (czyli undefined, null, 0, '' itp.), to użyje wartości 1 zamiast tego.
        existingProduct.quantity += action.payload.quantity || 1;
        // else – produkt nie ma w koszyku → tworzymy nowy wpis z quantity = 1 i dodajemy do tablicy.
      } else {
        state.cartProducts.push({
          ...action.payload,
          quantity: action.payload.quantity || 1, // Jeśli payload nie zawiera quantity, ustawiamy domyślnie 1.
          // W przeciwnym razie używamy podanej wartości.
        });
      }

      localStorage.setItem('cart', JSON.stringify(state.cartProducts));
    },
    /**
     * Usuwa produkt z koszyka po jego ID.
     * Zapisuje zmieniony koszyk do localStorage.
     */
    removeFromCart: (state, action) => {
      state.cartProducts = state.cartProducts.filter(
        (p) => p.id !== action.payload,
      );
      localStorage.setItem('cart', JSON.stringify(state.cartProducts));
    },

    /**
     * Aktualizuje quantity produktu w koszyku.
     * Nie dodaje nowego produktu, tylko zmienia ilość istniejącego.
     * Po zmianie zapisuje cały koszyk do localStorage.
     */
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload; // dostajesz id i nową ilość
      const product = state.cartProducts.find((p) => p.id === id); // znajdujesz produkt
      if (product) product.quantity = quantity; // aktualizujesz tylko pole quantity
      // Do localStorage trafia cała tablica produktów, wraz z wszystkimi ich właściwościami, w tym zaktualizowanym quantity.
      localStorage.setItem('cart', JSON.stringify(state.cartProducts)); // zapisujesz całą tablicę produktów
    },
    /**
     * Czyści cały koszyk.
     * Usuwa też zapis w localStorage.
     */
    clearCart: (state) => {
      state.cartProducts = [];
      localStorage.removeItem('cart');
    },
  },
});

/**
Memoizowane selektory — dzięki memoizacji (createSelector) nie będą się przeliczać przy każdym renderowaniu, czy każdej nawigacji, tylko wtedy, gdy cartProducts faktycznie się zmieni.
 */
/**
[...state.cart.cartProducts] → tworzy kopię tablicy, żeby nie zmieniać oryginalnego stanu w Reduxie.
.reverse() → odwraca kolejność, więc najnowszy produkt będzie pierwszy w mapowaniu w komponencie.
Dzięki temu wszędzie w aplikacji, gdzie używasz selectCartProducts, produkty będą automatycznie w kolejności “od najnowszego do najstarszego”.
 */
// Selektor jest do odczytu stanu cart w kolejności od najnowszego do najstarszego, z memoizacją dla wydajności.
export const selectCartProducts = createSelector(
  [(state) => state.cart.cartProducts], // ← tablica funkcji wejściowych
  (products) => [...products].reverse(), // ← funkcja obliczająca wynik
);

export const selectCartTotalPrice = createSelector(
  [selectCartProducts], // ← tablica funkcji wejściowych
  (products) =>
    products.reduce((acc, p) => acc + p.price * (p.quantity || 1), 0), // ← funkcja obliczająca wynik. Jeśli quantity nie istnieje, traktujemy produkt jakby miał 1 sztukę (dla sumowania ilości).
);

export const selectCartTotalItems = createSelector(
  [selectCartProducts],
  (products) => products.reduce((acc, p) => acc + (p.quantity || 1), 0), // p.quantity || 1 gwarantuje, że nawet jeśli quantity nie istnieje, produkt zostanie policzony jako 1 sztuka.
);

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;

/**
 Sytuacja	Co się dzieje bez memoizacji	Co się dzieje z memoizacją
Zmiana innego slice’a (np. favourites)	Cart się nie renderuje	Cart się nie renderuje
Render komponentu Cart (np. wejście na stronę)	reduce się liczy od nowa	reduce może zwrócić wynik z pamięci, jeśli cartProducts nie zmieniło się
Zmiana cartProducts	reduce przeliczany	reduce przeliczany (memoizacja tylko zapobiega powtórnemu liczeniu, jeśli dane się nie zmieniły)
 */
