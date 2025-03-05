import React from 'react';
import { useSelector } from 'react-redux';
/* import './BookDetailsPopup.css'; */

function BookDetailsPopup() {
  const { selectedBook } = useSelector(state => state.books);

  if (!selectedBook) return null;

  return (
    <div className="popup-container">
      <section className="popup-book-container">
        <section className="article-book" id="popup-book">
          <figure className="figure-rectangle"></figure>
          <article className="article-book-info">
            <h2>{selectedBook.title}</h2>
            <h3>{selectedBook.author}</h3>
          </article>
        </section>
        <section className="popup-book-info">
          <h2>{selectedBook.title}</h2>
          <h3>{selectedBook.author}</h3>
          <p>{selectedBook.plot}</p>
          <section className="popup-book-details">
            <p>Audience: {selectedBook.audience}</p>
            <p>First published: {selectedBook.year}</p>
            <p>Pages: {selectedBook.pages}</p>
            <p>Publisher: {selectedBook.publisher}</p>
          </section>
          <button className="btn">Oh, I want to read it!</button>
        </section>
      </section>
    </div>
  );
}

export default BookDetailsPopup;
