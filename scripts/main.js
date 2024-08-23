document.addEventListener('DOMContentLoaded', function() {

    // Cache DOM elements
    const searchButton = document.getElementById('search-button');
    const resultsSection = document.getElementById('results-section');
    const resultsDiv = document.getElementById('results');
    const searchInput = document.getElementById('search-input');

    // Trigger book search when "Search" button is clicked
    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value;
        if (searchTerm) {
            getBookInfo(searchTerm);
        }
    });

    // Fetch book information from the Open Library API
    function getBookInfo(query) {
        const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;

        fetch(url)
            .then(response => {
                console.log(response); // Check the response status and headers
                return response.json();
            })
            .then(data => {
                console.log(data); // Log the data to ensure you received the response
                if (data.docs && data.docs.length > 0) {
                    displayBookInfo(data.docs); // Pass the books data to display function
                } else {
                    displayError("No results found for the search term.");
                }
            })
            .catch(error => {
                displayError("Error fetching data from the API.");
                console.error('Error fetching data:', error);
            });
    }


    // Display book information on the page
    function displayBookInfo(books) {
        resultsDiv.innerHTML = ''; // Clear previous results
        resultsSection.style.display = 'block'; // Show the results section

        books.forEach(book => {
            if (book.cover_i) { // Only process books with a cover image
                const imgUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
                const imgElement = document.createElement('img');
                imgElement.src = imgUrl;
                imgElement.alt = book.title;
                imgElement.title = book.title;

                const titleElement = document.createElement('p');
                titleElement.textContent = book.title;

                const authorElement = document.createElement('p');
                authorElement.textContent = `Author: ${book.author_name ? book.author_name.join(', ') : 'Unknown'}`;

                const bookContainer = document.createElement('div');
                bookContainer.classList.add('book-container');
                bookContainer.appendChild(imgElement);
                bookContainer.appendChild(titleElement);
                bookContainer.appendChild(authorElement);

                resultsDiv.appendChild(bookContainer); // Add the book container to results section
            }
        });
    }

    // Display an error message if something goes wrong
    function displayError(message) {
        resultsDiv.innerHTML = ''; // Clear previous results
        resultsSection.style.display = 'block'; // Show the results section

        const errorElement = document.createElement('p');
        errorElement.textContent = message;
        errorElement.style.color = 'red';
        errorElement.style.textAlign = 'center';
        resultsDiv.appendChild(errorElement); // Display the error message
    }
});
