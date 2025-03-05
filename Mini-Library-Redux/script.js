
/* const getBooks = async () => {

    const data = await fetch('https://my-json-server.typicode.com/zocom-christoffer-wallenberg/books-api/books');
    const json = await data.json()

    console.log(json)

}

getBooks()
  */


///Gör om till interfaces och types t.ex. const data: Books [] = await




document.getElementById('search').addEventListener('input', function(event) {
    const searchTerm = event.target.value.toLowerCase();
    const books = document.querySelectorAll('.section-books .article-book'); // Endast böcker i huvudsektionen

    books.forEach(book => {
        const title = book.querySelector('h3').textContent.toLowerCase();
        if (title.includes(searchTerm)) {
            book.style.display = ''; // Visa boken
        } else {
            book.style.display = 'none'; // Dölj boken
        }
    });
});




const getBooks = async () => {
    const data = await fetch('https://my-json-server.typicode.com/zocom-christoffer-wallenberg/books-api/books');
    const books = await data.json();

    const articles = document.querySelectorAll('.article-book'); // Hitta alla artikel-element
    const bookDetailsContainer = document.querySelector('.popup-book-info'); // Hitta sektionen för bokinfo
    const popupBookArticle = document.querySelector('#popup-article');
    const firstPageContainer = document.querySelector('.first-page-container'); // Justera selektorn
    const popupContainer = document.querySelector('.popup-container'); // Hitta popup-containern
    
    articles.forEach(article => {
        article.addEventListener('click', () => {
            // Hitta boken baserat på artikelns id
            const clickedBook = books.find(book => book.title.includes(article.id));
            if (clickedBook) {

                // Uppdatera HTML-struktur för bokinformationen
                bookDetailsContainer.innerHTML = `
                    <h2>${clickedBook.title}</h2>
                    <h3>By ${clickedBook.author}</h3>
                    <p>${clickedBook.plot}</p>
                    <section class="popup-book-details">
                        <p>Audience: ${clickedBook.audience}</p>
                        <p>First published: ${clickedBook.year}</p>
                        <p>Pages: ${clickedBook.pages}</p>
                        <p>Publisher: ${clickedBook.publisher}</p>
                    </section>
                    <button class="btn" id="popup-btn">Oh, I want to read it!</button> <!-- Se till att knappen är här -->
                `;

                popupBookArticle.innerHTML = `
                    <h2>${clickedBook.title}</h2>
                    <h3>${clickedBook.author}</h3>
                `;

                // Ändra id på popup-elementet
                document.getElementById('popup-book').id = article.id;

                // Dölj första sidan och visa popup
                if (firstPageContainer) firstPageContainer.style.display = 'none';
                if (popupContainer) popupContainer.style.display = 'block';
            }
        });
    });
}

getBooks()


