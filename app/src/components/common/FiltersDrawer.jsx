import { Drawer, Box, FormControl, InputLabel, Select, MenuItem, TextField, Button, Typography } from '@mui/material';
import { CAPITALIZE, RATINGS } from '@/constants';

export const FiltersDrawer = ({
  open,
  onClose,
  categories,
  selectedCategory,
  sortOrder,
  selectedRating,
  searchQuery,
  onCategoryChange,
  onSortChange,
  onRatingChange,
  onSearchChange,
  onReset,
}) => {
  return (
    <Drawer anchor="right" open={open} onClose={onClose}>
      <Box sx={{ width: 250, p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6">Filters</Typography>

        {/* Kategoria */}
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select value={selectedCategory} onChange={(e) => onCategoryChange(e.target.value)} label="Category">
            <MenuItem value="all">All</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {CAPITALIZE(cat)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Sortowanie */}
        <FormControl fullWidth>
          <InputLabel>Sort</InputLabel>
          <Select value={sortOrder} onChange={(e) => onSortChange(e.target.value)} label="Sort">
            <MenuItem value="asc">Price: Low → High</MenuItem>
            <MenuItem value="desc">Price: High → Low</MenuItem>
          </Select>
        </FormControl>

        {/* Wyszukiwarka */}
        <TextField label="Search" value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} fullWidth />

        {/* Rating */}
        <FormControl fullWidth>
          <InputLabel>Rating</InputLabel>
          <Select value={selectedRating} onChange={(e) => onRatingChange(Number(e.target.value))} label="Rating">
            {RATINGS.map((rating) => (
              <MenuItem key={rating.value} value={rating.value}>
                {rating.value === 0 ? 'All' : `${rating.value} ★`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Reset i Close */}
        <Button variant="contained" color="secondary" onClick={onReset}>
          Reset
        </Button>

        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </Box>
    </Drawer>
  );
};
