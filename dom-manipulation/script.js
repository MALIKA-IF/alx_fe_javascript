
const quotes =[{text : "quotes 1" , category : 1},
    {Text : "quotes 2" , category : 2},
    {Text : "quotes 3" , category : 3}

]

function showRandomQuote(){

   const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];

    const display = document.getElementById('quoteDisplay');
    display.innerHTML = `
        <p>Quote: "${quote.text}"</p>
        <p>Category: ${quote.category}</p>
    `;
}

function createAddQuoteForm() {
    const formContainer = document.getElementById('formContainer');

    const form = document.createElement('form');

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.placeholder = 'Enter quote text';
    textInput.required = true;

    const categoryInput = document.createElement('input');
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter category';
    categoryInput.required = true;

    const submit = document.createElement('button');
    submit.type = 'submit';
    submit.textContent = 'Add Quote';

    
    form.appendChild(textInput);
    form.appendChild(categoryInput);
    form.appendChild(submit);

    
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const newQuote = {
            text: textInput.value.trim(),
            category: categoryInput.value.trim()
        };

        quotes.push(newQuote);

        textInput.value = '';
        categoryInput.value = '';

        alert('Quote added successfully!');
    });

   // formContainer.appendChild(form);
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
    document.getElementById('addQuoteBtn').addEventListener('click', createAddQuoteForm);
});

function LocalStorageQotes() {
    const savedQuotes = localStorage.getItem('quotes');
    if (savedQuotes) {
        quotes = JSON.parse(savedQuotes);
    }
}
function saveQuotesToLocalStorage() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

function exportQuotes() {
    const jsonStr = JSON.stringify(quotes, null, 2); 
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
document.getElementById('export').addEventListener('click', exportQuotesToJSON);

function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }

  function populateCategories() {
    const drop = document.getElementById('categoryFilter');
    
  
    drop.innerHTML = '<option value="">-- Select a category --</option>';

    // Use a Set to store unique categories
    const categories = new Set();
    quotes.forEach(quote => {
        if (quote.category) {
            categories.add(quote.category.trim());
        }
    });

    
    const sortedCategories = Array.from(categories).sort();

   
    sortedCategories.map(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        dropdown.appendChild(option);
    });
}

function filterQuotes() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    
    const filteredQuotes = selectedCategory
        ? quotes.filter(quote => quote.category === selectedCategory)
        : quotes;

    if (filteredQuotes.length === 0) {
        displayDiv.innerHTML = `<p>No quotes found for this category.</p>`;
        return;
    }

    filteredQuotes.forEach(quote => {
        const quoteElement = document.createElement('div');
        quoteElement.innerHTML = `
            <p><strong>Quote:</strong> "${quote.text}"</p>
            <p><strong>Category:</strong> ${quote.category}</p>
            <hr />
        `;
    });
}

const postsDiv = document.getElementById('posts');

    // Fetch data from API every 5 seconds
    function fetchQuotesFromServer() {
      fetchData(); // initial call
      setInterval(fetchData, 5000); // repeat every 5s
    }

    // GET data
    async function fetchData() {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=5');
        const data = await response.json();
        renderPosts(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    // Render posts
    function renderPosts(posts) {
      postsDiv.innerHTML = '';
      posts.forEach(post => {
        const div = document.createElement('div');
        div.innerHTML = `<h3>${post.title}</h3><p>${post.body}</p><hr>`;
        postsDiv.appendChild(div);
      });
    }

    // POST data
    async function postData() {
      const newPost = {
        title: 'New Post Title',
        body: 'This is the content of the new post.',
        userId: 1
      };

      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPost)
        });
        const result = await response.json();
        console.log('Posted:', result);
        alert('New post submitted! Check console.');
      } catch (error) {
        console.error('Error posting data:', error);
      }
    }

    // Start everything
    startFetchingData();

    const API_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=5';
    const STORAGE_KEY = 'quotes';
    const FETCH_INTERVAL = 10000; // 10 seconds

    // Fetch quotes from server
    async function fetchQuotesFromServer() {
      try {
        const response = await fetch(API_URL);
        const serverQuotes = await response.json();
        updateLocalStorage(serverQuotes);
        renderQuotes();
      } catch (error) {
        console.error('Failed to fetch quotes:', error);
      }
    }

    // Get quotes from local storage
    function getLocalQuotes() {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    }

    // Update local storage with server data (server wins conflicts)
    function updateLocalStorage(serverQuotes) {
      const localQuotes = getLocalQuotes();
      const mergedQuotes = [];

      serverQuotes.forEach(serverQuote => {
        const localQuote = localQuotes.find(q => q.id === serverQuote.id);

        if (!localQuote || JSON.stringify(localQuote) !== JSON.stringify(serverQuote)) {
          // New or updated quote (server takes precedence)
          mergedQuotes.push(serverQuote);
        } else {
          // No change, keep local
          mergedQuotes.push(localQuote);
        }
      });

      localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedQuotes));
    }

    // Render quotes to the DOM
    function renderQuotes() {
      const quotes = getLocalQuotes();
      const quoteList = document.getElementById('quoteList');
      quoteList.innerHTML = '';

      quotes.forEach(quote => {
        const div = document.createElement('div');
        div.innerHTML = `<strong>${quote.title}</strong><p>${quote.body}</p><hr>`;
        quoteList.appendChild(div);
      });
    }

    // Initial fetch and periodic update
    fetchQuotesFromServer(); // Initial load
    setInterval(fetchQuotesFromServer, FETCH_INTERVAL);