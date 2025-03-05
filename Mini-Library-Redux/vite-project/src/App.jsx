import React from 'react';


import SearchBar from './components/SearchBar/SearchBar';
import BookDetailsPopup from './components/BookDetailsPopup/BookDetailsPopup';
import BookList from './components/Booklist/Booklist';

function App() {
  return (
    <div className="App">
      <SearchBar />
      <BookList />
      <BookDetailsPopup />
    </div>
  );
}

export default App;
