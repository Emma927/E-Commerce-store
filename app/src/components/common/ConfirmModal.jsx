import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from '@mui/material';

// ConfirmModal – nie warto memoizować, bo rerender jest rzadki i koszt niewielki
export const ConfirmModal = ({
  open,
  title,
  description,
  onCancel,
  onConfirm,
  confirmText = 'OK',
  cancelText = 'Cancel',
  confirmColor = 'primary',
  icon,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onCancel}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
      /*
        UWAGA:
        W konsoli może pojawić się ostrzeżenie:
        "Blocked aria-hidden on an element because its descendant retained focus."

        To jest normalne przy Dialogach MUI – biblioteka dodaje aria-hidden do reszty DOM,
        żeby ukryć go przed czytnikami ekranowymi. Jeśli focus jest nadal na ukrytym elemencie,
        przeglądarka zgłosi ostrzeżenie.  

        Jest to ostrzeżenie informacyjne – **nie wpływa na działanie dialogu**.
        Focus i dostępność są poprawnie obsługiwane przez MUI.  
        Można bezpiecznie je zignorować.
      */
    >
      <DialogTitle
        id="confirm-dialog-title"
        sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
      >
        {icon} {title}
      </DialogTitle>

      <DialogContent id="confirm-dialog-description">
        <Typography>{description}</Typography>
      </DialogContent>

      <DialogActions>
        {onCancel && <Button onClick={onCancel}>{cancelText}</Button>}
        {onConfirm && (
          <Button
            autoFocus
            variant="contained"
            color={confirmColor}
            onClick={onConfirm}
          >
            {confirmText}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
