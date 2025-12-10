import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Spinner } from '@/components/common/Spinner';
import { TextFieldComponent } from '../components/common/TextFieldComponent';
import { useForm, FormProvider, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLogin } from '@/hooks/useLogin';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '@/store/authSlice';
import { useLocation } from 'react-router-dom';

const loginSchema = z.object({
  username: z.string().min(1, { message: 'Username does not match' }),
  password: z.string().min(1, { message: 'Password does not match' }),
  remember: z.boolean().optional(), // niewymuszone zaznaczenie checkbox
});

const defaultLoginValues = {
  username: '',
  password: '',
  remember: false,
};

/** Dane użytkownika z Fake API store do autoryzacji:
username: "johnd", 
password: "m38rmF$"
token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInVzZXIiOiJqb2huZCIsImlhdCI6MTc2Mzk5NzA5NH0.QFjrywGut20f5Yf856zNMbfB34Eg91E5pN6tP9KNgLQ"
*/

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  // Wyciągnięcie całego obiektu methods, który zawiera wszyskie metody, zamiast destrukturyzować pojedyncze metody
  const methods = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: defaultLoginValues,
  });

  // Hook useLogin() zwraca obietk mutation, a dzięki destrukturyazji tego obiektu mamy dostęp do tokena
  const { mutate, isPending, isError, error } = useLogin(); // Zwraca obiekt z metodami i stanami, a nie z końcowymi danymi z POST. W skrócie: useLogin zwraca obiekt mutation, ale dane z POST nie są “wewnątrz hooka” – są zarządzane przez React Query i udostępniane przez jego stan.

  /*
Wszystkie etapy przepływu danych i kontroli, od interakcji użytkownika, przez działanie biblioteki, aż po finalne użycie danych w kodzie:
1) Użytkownik uzupełnił dane i kliknął onSubmit.
2) onSubmit wywołuje mutate.
3) mutate daje sygnał QueryClient, aby uruchomił mutationFn i zmienił status stanu ładowania.
4) mutationFn rozpoczyna żądanie POST (sieć).
5) Po pomyślnym zakończeniu żądania mutationFn zwraca dane (return response.json()). zwrócone przez mutationFn dane trafiają bezpośrednio do QueryClienta, aktualizuje status mutacji na success i przekazuje te dane do callbacka onSuccess w mutate. To mutationFn jest odpowiedzialne za zwrócenie danych, a QueryClient tylko nimi zarządza, a nie sam je pobiera z sieci. Nie ma znaczenia, gdzie trzymane jest onSuccess, czy w mutate w Login.jsx, czy w mutationFn w hooku useLogin — dane zawsze przechodzą przez QueryClient, który zarządza statusem i cache mutacji.
*/

  const onSubmit = (formData) => {
    // Mutate zawiera gotowe Callbacki jak: onSuccess, onError
    mutate(
      { username: formData.username, password: formData.password },
      {
        // W callbacku onSuccess kolejność parametrów jest ustalona przez React Query i nie możesz ich zamienić miejscami:
        // Pierwszy parametr (data) – zawsze wynik mutationFn, czyli odpowiedź z API (return response.json()).
        // Drugi parametr (variables) – zawsze obiekt, który przekazałaś do mutate() ({ username, password }).
        // Status, isPending, isSuccess, isError, error: Mówią nam co się dzieje z mutacją w danej chwili. Te wartości powodują re-render komponentu, gdy się zmieniają.

        // data → wynik mutationFn, czyli odpowiedź z API
        // variables → obiekt przekazany do mutate(), czyli { username, password }
        onSuccess: (data, variables) => {
          const userData = { username: variables.username, token: data.token };
          localStorage.setItem('user', JSON.stringify(userData));
          localStorage.setItem('token', data.token);
          dispatch(login({ username: variables.username, token: data.token })); // Aktualizacja stanu w store, tutaj onSuccess jest lokalny, ale jego efektem jest aktualizacja globalnego stanu RTK.
          methods.reset(defaultLoginValues); // reset jest potrzebny w obu przypadkach RHF i useState, jeśli komponent nie odmontowuje się, bo nie nawigujemy na inną stronę po udanym logowaniu na przykład na stronę główną. Podczas ponownego mountu czyli nawigacji na inną stronę i spowrotem na Login, React Hook Form tworzy nowy formState, który przyjmuje defaultValues.
          navigate(from, { replace: true }); // ← teraz wraca na stronę, z której przyszedł, czyli na from
        },
        onError: (error) => {
          console.error('Login failed', error);
        },
        onSettled: () => {
          () => console.log('Mutatin end');
        },
      }
    );
  };

  return (
    <FormProvider {...methods}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          {/* noValidate  - Wyłącza domyślną walidację HTML5 z przeglądarki i nie będzie pokazywać własnych komunikatów błędów (te małe dymki z przeglądarki). Formularz będzie korzystał tylko z walidacji React Hook Form. Warto przy pracy z własnym systemem błędów i komunikatami (helperText). */}
          {/* handleSubmit sam przechwytuje submit i blokuje domyślne odświeżenie strony, które normalnie wywołuje HTML-owy <form>.
Jeśli dodamy onSubmit={(e) => { e.preventDefault(); ... }}, to nic złego się nie stanie, ale jest to zbędne, bo RHF już to robi za nas. */}
          <Box component="form" noValidate sx={{ mt: 1 }} onSubmit={methods.handleSubmit(onSubmit)}>
            {/* autoFocus to atrybut HTML/prop dla komponentów input, w tym dla MUI <TextField>, który automatycznie ustawia fokus na tym polu po załadowaniu strony lub renderze komponentu. */}
            <TextFieldComponent label="Username" name="username" type="text" autoFocus />
            <TextFieldComponent label="Password" type="password" name="password" />
            <Controller
              name="remember"
              control={methods.control}
              render={({ field }) => (
                <FormControlLabel
                  control={<Checkbox {...field} color="primary" checked={field.value} />}
                  label="Remember me"
                />
              )}
            />
            {methods.formState.errors.remember && <p>{methods.formState.errors.remember.message}</p>}
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={isPending}>
              {isPending ? (
                <>
                  <Spinner />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
            {/* Komunikat błędu */}
            {isError && (
              <Typography color="error" align="center">
                {error?.message || 'Error occured'}
              </Typography>
            )}
          </Box>
        </Box>
      </Container>
    </FormProvider>
  );
};

export default Login;

/**
Aplikacja ma pełne zarządzanie stanem autoryzacji użytkownika:
- Redux Toolkit → globalny stan.
- localStorage → trwałość po odświeżeniu.
- React Query → obsługa mutation i statusów żądania (loading, error).
- Komponent Login → integracja z RTK i React Query.
 */
