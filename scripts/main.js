document.addEventListener('DOMContentLoaded', function () {
    // Cache DOM elements
    const searchButton = document.getElementById('search-button');
    const resultsSection = document.getElementById('results-section');
    const resultsDiv = document.getElementById('resultsDiv');
    const searchInput = document.getElementById('search-input');

    // Trigger book search when "Search" button is clicked
    searchButton.addEventListener('click', function () {
        const searchTerm = searchInput.value;
        if (searchTerm) {
            getBookInfo(searchTerm);
        } else {
            displayError("Please enter the title of the book you want to search.");
        }
    });

    // Fetch book information from the Open Library API
    async function getBookInfo(query) {
        const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.docs && data.docs.length > 0) {
                displayBookInfo(data.docs); // Pass the books data to display function
            } else {
                displayError("No results found for the search term.");
            }
        } catch (error) {
            displayError("Error fetching data from the API.");
            console.error('Error fetching data:', error);
        }
    }
    
    // Function to display book information on the page
    async function displayBookInfo(books) {
        resultsDiv.innerHTML = ''; // Clear previous results
        resultsSection.style.display = 'block'; // Show the results section

        const langPair = document.querySelector('#search-dropdown').selectedOptions[0].dataset.langpair;

        for (const book of books) {
            const bookContainer = document.createElement('div');
            bookContainer.classList.add('book-container');

            if (book.cover_i) {
                const imgUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`;
                const imgElement = document.createElement('img');
                imgElement.src = imgUrl;
                imgElement.alt = book.title;
                imgElement.title = book.title;
                bookContainer.appendChild(imgElement);
            } else {
                const noImageElement = document.createElement('p');
                noImageElement.textContent = "No cover image found for the book.";
                bookContainer.appendChild(noImageElement);
            }

            const titleElement = document.createElement('p');
            titleElement.textContent = `Title: ${book.title}`;
            const authorElement = document.createElement('p');
            authorElement.textContent = `Author: ${book.author_name ? book.author_name.join(', ') : 'Unknown'}`;
            bookContainer.appendChild(titleElement);
            bookContainer.appendChild(authorElement);

            // If a language pair is selected, translate the title and author
            if (langPair) {
                const translatedTitle = await getTranslatedText(book.title, langPair);
                const translatedAuthor = await getTranslatedText(book.author_name ? book.author_name.join(', ') : 'Unknown', langPair);

                const translatedTitleElement = document.createElement('p');
                translatedTitleElement.textContent = `Translated Title: ${translatedTitle}`;
                bookContainer.appendChild(translatedTitleElement);

                const translatedAuthorElement = document.createElement('p');
                translatedAuthorElement.textContent = `Translated Author: ${translatedAuthor}`;
                bookContainer.appendChild(translatedAuthorElement);
            }

            resultsDiv.appendChild(bookContainer);
        }
    }

    // Function to display error messages
    function displayError(message) {
        resultsDiv.innerHTML = ''; // Clear previous results
        resultsSection.style.display = 'block'; // Ensure the results section is visible
        const errorElement = document.createElement('p');
        errorElement.textContent = message;
        errorElement.classList.add('error-message');
        resultsDiv.appendChild(errorElement);
    }
});
