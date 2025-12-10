import { createSlice, createSelector } from '@reduxjs/toolkit';

// Wczytanie koszyka z localStorage przy starcie
const savedCart = JSON.parse(localStorage.getItem('cart')) || [];

const initialState = {
  cartProducts: savedCart,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // W koszyku możesz mieć wiele sztuk tego samego produktu, np. 3 razy ten sam kubek → wtedy liczy się quantity, a nie blokujesz dodawania.
    addToCart: (state, action) => {
      // state.cartProducts.push(action.payload);
      // localStorage.setItem('cart', JSON.stringify(state.cartProducts));
      const existingProduct = state.cartProducts.find((p) => p.id === action.payload.id);

      // if (existingProduct) – produkt jest już w koszyku → zwiększamy jego quantity o 1.
      //Jeśli produkt już istnieje → zwiększamy quantity.
      // Jeśli produktu nie ma → dodajemy nowy z domyślną ilością 1 (|| 1).
      if (existingProduct) {
        existingProduct.quantity += action.payload.quantity || 1;
      // else – produkt nie ma w koszyku → tworzymy nowy wpis z quantity = 1 i dodajemy do tablicy.
      } else {
        state.cartProducts.push({ ...action.payload, quantity: action.payload.quantity || 1 });
      }

      localStorage.setItem('cart', JSON.stringify(state.cartProducts));
    },
    removeFromCart: (state, action) => {
      state.cartProducts = state.cartProducts.filter((p) => p.id !== action.payload);
      localStorage.setItem('cart', JSON.stringify(state.cartProducts));
    },
    // Szukasz w tablicy cartProducts produktu o tym samym id.0
    // Zmieniasz jego quantity zamiast dodawać nowy obiekt do tablicy.
    // localStorage działa tak, że zapisujesz ciąg znaków (string) jako wartość pod kluczem. Nie ma tam możliwości „podmiany jednego pola w obiekcie w tablicy” w pamięci — musisz zserializować cały obiekt lub tablicę, czyli w Twoim przypadku całą tablicę state.cartProducts.
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload; // dostajesz id i nową ilość
      const product = state.cartProducts.find((p) => p.id === id); // znajdujesz produkt
      if (product) product.quantity = quantity; // aktualizujesz tylko pole quantity
      // Do localStorage trafia cała tablica produktów, wraz z wszystkimi ich właściwościami, w tym zaktualizowanym quantity.
      localStorage.setItem('cart', JSON.stringify(state.cartProducts)); // zapisujesz całą tablicę produktów
    },
    clearCart: (state) => {
      state.cartProducts = [];
      localStorage.removeItem('cart');
    },
  },
});

// 🔹 Selektory
/*export const selectCartProducts = (state) => state.cart.cartProducts;

export const selectCartTotalPrice = (state) =>
  state.cart.cartProducts.reduce((acc, p) => acc + p.price * (p.quantity || 1), 0);

export const selectCartTotalItems = (state) => state.cart.cartProducts.reduce((acc, p) => acc + (p.quantity || 1), 0);*/

// 🔹 Selektory podstawowe
// export const selectCartProducts = (state) => state.cart.cartProducts;
// 🔹 Selektor zwracający produkty w odwrotnej kolejności (od najnowszego)
/**
 createSelector memoizuje wynik:

jeśli wejściowa tablica (favouritesProducts) nie zmieniła się, zwraca tę samą referencję,

więc React-Redux nie wywołuje rerenderu i nie ma ostrzeżeń.
 */
 /*
W aplikacji wejściowa tablica nie zmienia się referencyjnie przy każdym renderze/redux update.

createSelector widzi tę samą referencję → memoizacja działa → .reverse() zwraca nową tablicę tylko wtedy, gdy faktycznie zmieniła się zawartość.

Stąd brak ostrzeżeń.
*/
export const selectCartProducts = createSelector(
  [(state) => state.cart.cartProducts],
  (products) => [...products].reverse()
);

/**
 💡 Wyjaśnienie:

[...state.cart.cartProducts] → tworzy kopię tablicy, żeby nie zmieniać oryginalnego stanu w Reduxie.

.reverse() → odwraca kolejność, więc najnowszy produkt będzie pierwszy w mapowaniu w komponencie.

Dzięki temu wszędzie w aplikacji, gdzie używasz selectCartProducts, produkty będą automatycznie w kolejności “od najnowszego do najstarszego”.
 */

// 🔹 Memoizowane selektory - Dokładnie — dzięki memoizacji (createSelector) nie będą się przeliczać przy każdym renderowaniu, czy każdej nawigacji, tylko tylko wtedy, gdy cartProducts faktycznie się zmieni.
export const selectCartTotalPrice = createSelector([selectCartProducts], (products) =>
  products.reduce((acc, p) => acc + p.price * (p.quantity || 1), 0)
);

export const selectCartTotalItems = createSelector([selectCartProducts], (products) =>
  products.reduce((acc, p) => acc + (p.quantity || 1), 0)
);

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

/**
 Sytuacja	Co się dzieje bez memoizacji	Co się dzieje z memoizacją
Zmiana innego slice’a (np. favourites)	Cart się nie renderuje	Cart się nie renderuje
Render komponentu Cart (np. wejście na stronę)	reduce się liczy od nowa	reduce może zwrócić wynik z pamięci, jeśli cartProducts nie zmieniło się
Zmiana cartProducts	reduce przeliczany	reduce przeliczany (memoizacja tylko zapobiega powtórnemu liczeniu, jeśli dane się nie zmieniły)
 */

/**
 Pytanie: To createSelector jest jak use memo, czy react.memo?

ChatGPT powiedział:

Tu znowu jest podobna idea, ale nie to samo, choć cel jest podobny: zapobieganie niepotrzebnym obliczeniom lub rerenderom. Wyjaśnijmy krok po kroku:

1️⃣ useMemo

Memoizuje wynik funkcji w komponencie.

Przykład: liczysz coś kosztownego w komponencie i nie chcesz, żeby liczenie odbywało się przy każdym renderze.

const total = useMemo(() => cartProducts.reduce((acc, p) => acc + p.price, 0), [cartProducts]);


Działa tylko w komponencie, zależy od wartości w dependency array.

Jeśli zależności się nie zmienią → wynik jest zwracany z pamięci (memoized).

2️⃣ React.memo

Memoizuje sam komponent.

Komponent nie rerenderuje się, jeśli jego propsy się nie zmieniły.

const CartItem = React.memo(({ product }) => {
  return <div>{product.name}</div>;
});


Idealne dla list / ciężkich komponentów, żeby nie renderować ich ponownie, jeśli props się nie zmieni.

3️⃣ createSelector (Redux / Reselect)

Memoizuje wynik selektora w Redux.

Dzięki temu nie przeliczamy np. sumy czy filtrowania, jeśli state.cart.cartProducts się nie zmieniło.

export const selectCartTotalPrice = createSelector(
  [selectCartProducts],
  (products) => products.reduce((acc, p) => acc + p.price * (p.quantity || 1), 0)
);


Działa globalnie, niezależnie od komponentów, które używają selektora.

🔹 Podsumowanie w prostych słowach:
Narzędzie	Co memoizuje?	Zakres
useMemo	Wynik funkcji	W komponencie
React.memo	Sam komponent	W komponencie
createSelector	Wynik selektora / przetwarzanie store	Globalnie (Redux)
 */
