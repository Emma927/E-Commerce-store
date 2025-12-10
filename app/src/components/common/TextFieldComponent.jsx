import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';
/**
 Schemat wygląda mniej więcej tak:

useForm() → tworzy instancję formularza (methods) z polami jak control, register, handleSubmit, formState itd.

<FormProvider {...methods}> → przekazuje całą instancję (methods) do React Context.

useFormContext() w komponencie dziecięcym → odczytuje te same metody z Contextu, w tym control.

Controller w dziecku może używać control pobranego z Contextu lub przekazanego bezpośrednio z rodzica.

W skrócie: instancja useForm() = źródło, Provider = „przekaźnik” do Contextu, a useFormContext() = konsument Contextu.
 */
/**
FormProvider udostępnia kontekst formularza (methods) wszystkim komponentom potomnym, które używają useFormContext().

Każdy TextFieldComponent w tym formularzu jest dzieckiem FormProvider i może pobierać control, errors itp. z tego samego formularza przez useFormContext().
 */
export const TextFieldComponent = ({ name, label, type = 'text', ...props }) => {
  const {
    control, // zamiat register będzie control,
    formState: { errors },
  } = useFormContext();
  /*!! konwertuje dowolną wartość do boolean:*/
  /**
 Przykłady:

!!1        // true
!!0        // false
!!"text"   // true
!!""       // false
!!null     // false
!!undefined // false
 */

  return (
    // || '' – zapobiega wyświetlaniu undefined w helperText, jeśli nie ma błędu.
    /**
     Tak! W Controller z react-hook-form prop render otrzymuje obiekt z kilkoma właściwościami, a jedną z nich jest właśnie field.

field zawiera podstawowe propsy potrzebne do kontrolowania inputa, czyli m.in.:

{
  onChange,   // funkcja wywoływana przy zmianie wartości
  onBlur,     // funkcja wywoływana przy odpuszczeniu inputa
  value,      // aktualna wartość inputa
  name,       // nazwa pola w formularzu
  ref         // ref do inputa (do focus/validacji)
}
     */
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          fullWidth
          margin="normal"
          label={label}
          type={type}
          // {...register(name)}
          error={!!errors[name]}
          helperText={errors[name]?.message || ''}
          {...props}
        />
      )}
    />
  );
};

/**
 * Czyli:
 *
 * - Bez || '' → helperText czasami dostaje undefined.
 * - Z || '' → zawsze jest string ('' gdy brak błędu).
 *
 * Podsumowanie
 *
 * - Czasami → kiedy walidacja przechodzi i errors[name] nie istnieje → wynik to undefined.
 * - Zawsze → kiedy dodasz || '', bo wtedy w scenariuszu „brak błędu” zamiast undefined masz ''.
 * */
