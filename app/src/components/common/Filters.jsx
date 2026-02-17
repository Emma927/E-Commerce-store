import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from '@mui/material';
import { CAPITALIZE, RATINGS } from '@/constants';

export const Filters = ({
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
  idPrefix,
}) => {
  const categoryId = `${idPrefix}-category`;
  const sortId = `${idPrefix}-sort`;
  const searchId = `${idPrefix}-search`;
  const ratingId = `${idPrefix}-rating`;
  return (
    <>
      {/* CATEGORY */}
      <FormControl sx={{ minWidth: 150 }}>
        <InputLabel id={`${categoryId}-label`} htmlFor={categoryId}>
          Category
        </InputLabel>
        <Select
          labelId={`${categoryId}-label`}
          value={selectedCategory}
          onChange={onCategoryChange}
          label="Category"
          inputProps={{
            id: categoryId,
            name: 'category',
          }}
        >
          <MenuItem value="all">All</MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {CAPITALIZE(cat)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* SORT */}
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id={`${sortId}-label`} htmlFor={sortId}>
          Sort
        </InputLabel>
        <Select
          labelId={`${sortId}-label`}
          value={sortOrder}
          onChange={onSortChange}
          label="Sort" // label="Sort" w <Select> odpowiada za to, jak szeroka ma być ta przerwa w ramce, czyli tak szeroka jak napis wewnątrz InputLabel dla tego Selecta
          //  2. KLUCZ: inputProps nadaje ID bezpośrednio elementowi, którego szuka Lighthouse do testu dostępności, czyli #sort-select-input. Bez tego, Lighthouse nie widzi powiązania między label a selectem i wywala błąd "Element has no accessible name". Dzięki inputProps z id, Lighthouse widzi, że InputLabel jest powiązany z Selectem i test przechodzi.
          inputProps={{
            id: sortId,
            name: 'sortOrder',
          }}
        >
          <MenuItem value="asc">Price: Low → High</MenuItem>
          <MenuItem value="desc">Price: High → Low</MenuItem>
        </Select>
      </FormControl>

      {/* SEARCH */}
      <TextField
        label="Search"
        id={searchId}
        name="search"
        value={searchQuery}
        onChange={onSearchChange}
        sx={{ minWidth: 180 }}
      />

      {/* RATING */}
      <FormControl sx={{ minWidth: 120 }}>
        <InputLabel id={`${ratingId}-label`} htmlFor={ratingId}>
          Rating
        </InputLabel>
        <Select
          labelId={`${ratingId}-label`} // Dla osoby niewidomej, labelId sprawia, że po wejściu na pole usłyszy ona nazwę filtra, zanim jeszcze zacznie wybierać opcje.
          value={selectedRating}
          onChange={onRatingChange}
          label="Rating"
          inputProps={{
            id: ratingId,
            name: 'rating',
          }}
        >
          {RATINGS.map((rating) => (
            <MenuItem key={rating.value} value={rating.value}>
              {rating.value === 0 ? 'All' : `${rating.value} ★`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* RESET */}
      <Button
        variant="contained"
        color="secondary"
        onClick={onReset}
        sx={{ ml: { md: 2 } }}
      >
        Reset
      </Button>
    </>
  );
};
