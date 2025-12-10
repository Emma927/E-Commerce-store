import { memo } from "react";

// React.memo zapobiega rerenderowaniu starego elementu koszyka CartItem Component, gdy dodawany jest nowy produkt lub gdy rodzic rerenderuje się, np. przy otwarciu drawer’a.
// Obecnie korzyść jest niewielka, bo propsy są prymitywami (image, title, price), ale memo przygotowuje komponent na przyszłe rozszerzenia, np. jeśli pojawią się funkcje lub obiekty w propsach.
import { Box, Typography } from "@mui/material";

const CartItemCardComponent = ({ image, title, price }) => {
  return (
    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
      {/* Obrazek w Boxie, który kontroluje wymiary */}
      <Box
        component="img"
        src={image}
        alt={title}
        sx={{
          width: { xs: 60, sm: 80, md: 100 }, // responsywna szerokość
          height: "auto", // wysokość dopasowuje się proporcjonalnie
          objectFit: "contain", // zachowanie proporcji
          flexShrink: 0, // nie kurczy się w flex
        }}
      />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="subtitle1" marginBottom={1}>
          {title}
        </Typography>
        <Typography variant="body2">${Number(price).toFixed(2)}</Typography>
      </Box>
    </Box>
  );
};

export const CartItemCard = memo(CartItemCardComponent);