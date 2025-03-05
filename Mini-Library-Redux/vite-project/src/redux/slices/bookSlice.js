import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  books: [],
  filteredBooks: [],
  searchQuery: '',
  selectedBook: null,
};

const bookSlice = createSlice({
  name: 'books',
  initialState,
  reducers: {
    setBooks: (state, action) => {
      state.books = action.payload;
      state.filteredBooks = action.payload; // Visa alla böcker som standard
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.filteredBooks = state.books.filter(book =>
        book.title.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
    setBookDetails: (state, action) => {
      state.selectedBook = action.payload;
    },
  },
});

export const { setBooks, setSearchQuery, setBookDetails } = bookSlice.actions;

export default bookSlice.reducer;
