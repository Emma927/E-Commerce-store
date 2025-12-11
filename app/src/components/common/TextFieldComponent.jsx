import TextField from '@mui/material/TextField';
import { useFormContext, Controller } from 'react-hook-form';

export const TextFieldComponent = ({
  name,
  label,
  type = 'text',
  ...props
}) => {
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
- render to właściwość (prop), która przekazywana jest jako funkcja. To funkcja, która otrzymuje obiekt z kilkoma właściwościami, m.in. field, fieldState i formState.

 - field zawiera podstawowe propsy potrzebne do kontrolowania inputa, czyli m.in.:
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
 * - Czasami → kiedy walidacja przechodzi i errors[name] nie istnieje → wynik to undefined.
 * - Zawsze → kiedy dodasz || '', bo wtedy w scenariuszu „brak błędu” zamiast undefined masz ''.
 * */
