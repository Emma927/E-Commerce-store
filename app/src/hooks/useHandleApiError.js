import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from 'react-toastify';

/**
 * Hook do obsługi błędów API
 * [queryKey] - opcjonalny klucz query do refetchu
 * [options] - opcjonalne ustawienia
 * [options.useToast=true] - czy używać toast
 */
export const useHandleApiError = (queryKey, options = { useToast: true }) => {
  const queryClient = useQueryClient();

  /**
   * Bez useCallback funkcja byłaby tworzona przy każdym renderze → useEffect odpalałby się za każdym razem.
   * Z useCallback referencja się nie zmienia, dopóki nie zmienią się zależności (queryClient, queryKey, options).
   */
  const handleError = useCallback(
    (error) => {
      const { useToast } = options;

      if (!error?.response) {
        if (useToast) toast.error('Network error. Check your connection.');
        return 'Network error';
      }

      const status = error.response.status;
      const message = error.response.data?.message || error.message;

      if (status >= 500) {
        if (useToast) toast.error(`Server error (${status}). Click to retry.`);
        if (queryKey) {
          queryClient.invalidateQueries(queryKey, { exact: false });
        }
        return `Server error (${status})`;
      } else if (status >= 400) {
        if (useToast) toast.warn(`Request failed (${status}): ${message}`);
        return `Client error (${status}): ${message}`;
      } else {
        if (useToast) toast.info(message || 'Unexpected error occurred.');
        return message || 'Unexpected error';
      }
    },
    [queryClient, queryKey, options],
  );

  return handleError;
};
