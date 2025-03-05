import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBooks, setBookDetails } from '../../redux/slices/bookSlice';
import './BookList.css';
import BookDetailsPopup from '../BookDetailsPopup/BookDetailsPopup';

function BookList() {
  const dispatch = useDispatch();
  
  // Hämta filteredBooks och searchQuery från Redux store
  const { filteredBooks, searchQuery } = useSelector((state) => state.books);

  useEffect(() => {
    // Hämta böcker från API
    const getBooks = async () => {
      const response = await fetch('https://my-json-server.typicode.com/zocom-christoffer-wallenberg/books-api/books');
      const books = await response.json();
      dispatch(setBooks(books)); // Uppdatera Redux med böcker
    };

    getBooks();
  }, [dispatch]);

  const handleBookClick = (book) => {
    dispatch(setBookDetails(book)); // Uppdatera den valda boken
    console.log(book);
  };

  return (
    <section className="section-books">
      {filteredBooks.length > 0 ? (
        filteredBooks.map((book) => (
          <article
            key={book.id}
           /*  id={book.title.replace(/\s+/g, '')} */
           id={`book-id-${book.id}`} // Lägg till prefix "book-id-" för ett giltigt id
            className="article-book"
            onClick={() => handleBookClick(book)}
          >
            <figure className="figure-rectangle"></figure>
            <article className="article-book-info">
              <h3>{book.title}</h3>
              <h4>{book.author}</h4>
            </article>
          </article>
        ))
      ) : (
        <p>No books found matching '{searchQuery}'</p>
      )}
      <BookDetailsPopup />
    </section>
  );
}

export default BookList;
