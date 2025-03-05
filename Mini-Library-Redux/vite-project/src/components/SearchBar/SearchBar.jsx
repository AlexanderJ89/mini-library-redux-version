import React from 'react';
import { useDispatch } from 'react-redux';
import { setSearchQuery } from '../../redux/slices/bookSlice';
/* import './SearchBar.css'; */

function SearchBar() {
  const dispatch = useDispatch();

  const handleSearchChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  return (
    <form className="search-form">
      <input
        type="search"
        name="search"
        id="search"
        className="form-input"
        placeholder="Search books..."
        onChange={handleSearchChange}
      />
      <button className="btn">Search</button>
    </form>
  );
}

export default SearchBar;
