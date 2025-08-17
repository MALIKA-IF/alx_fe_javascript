
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
    async function syncQuotes() {
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
    syncQuotes(); // Initial load
    setInterval(fetchQuotesFromServer, FETCH_INTERVAL);

    const API_URL = 'https://jsonplaceholder.typicode.com/posts?_limit=5';
    const STORAGE_KEY = 'quotes';
    const FETCH_INTERVAL = 10000; // 10s

    const notificationDiv = document.getElementById('notification');
    const quoteList = document.getElementById('quoteList');

    function showNotification(message, duration = 3000) {
      notificationDiv.textContent = message;
      notificationDiv.style.display = 'block';
      setTimeout(() => {
        notificationDiv.style.display = 'none';
      }, duration);
    }

    function getLocalQuotes() {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    }

    function saveQuotesToLocal(quotes) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(quotes));
    }

    // Detect and optionally resolve conflicts
    function updateLocalStorage(serverQuotes) {
      const localQuotes = getLocalQuotes();
      let updated = false;
      const newQuotes = [];
      const conflicts = [];

      serverQuotes.forEach(serverQuote => {
        const localQuote = localQuotes.find(q => q.id === serverQuote.id);

        if (!localQuote) {
          // New quote from server
          newQuotes.push(serverQuote);
          updated = true;
        } else if (JSON.stringify(localQuote) !== JSON.stringify(serverQuote)) {
          // Conflict detected
          conflicts.push({ local: localQuote, server: serverQuote });
        } else {
          newQuotes.push(localQuote); // No changes
        }
      });

      if (conflicts.length > 0) {
        showNotification(`Conflicts detected. Manual resolution required.`);
        renderConflicts(conflicts, newQuotes);
      } else {
        if (updated) {
          showNotification('New quotes fetched and updated.');
        }
        saveQuotesToLocal(newQuotes);
        renderQuotes();
      }
    }

    // Render quotes in the UI
    function renderQuotes() {
      const quotes = getLocalQuotes();
      quoteList.innerHTML = '';
      quotes.forEach(quote => {
        const div = document.createElement('div');
        div.className = 'quote';
        div.innerHTML = `<strong>${quote.title}</strong><p>${quote.body}</p>`;
        quoteList.appendChild(div);
      });
    }

    // Render conflicts and allow manual resolution
    function renderConflicts(conflicts, baseQuotes) {
      quoteList.innerHTML = '';

      conflicts.forEach(({ local, server }) => {
        const container = document.createElement('div');
        container.className = 'conflict';

        container.innerHTML = `
          <p><strong>Conflict on Quote ID ${server.id}</strong></p>
          <div><strong>Server:</strong> <em>${server.title}</em> - ${server.body}</div>
          <div><strong>Local:</strong> <em>${local.title}</em> - ${local.body}</div>
          <button class="btn btn-primary" onclick="resolveConflict(${server.id}, 'server')">Keep Server</button>
          <button class="btn btn-secondary" onclick="resolveConflict(${server.id}, 'local')">Keep Local</button>
        `;

        quoteList.appendChild(container);
      });

      // Store unresolved quotes temporarily
      window._pendingBaseQuotes = baseQuotes;
      window._pendingConflicts = conflicts;
    }

    // Resolve conflict manually
    function resolveConflict(id, choice) {
      const base = window._pendingBaseQuotes || [];
      const conflicts = window._pendingConflicts || [];

      const conflict = conflicts.find(c => c.server.id === id);
      if (!conflict) return;

      const selected = choice === 'server' ? conflict.server : conflict.local;
      base.push(selected);

      // Remove this conflict
      const remaining = conflicts.filter(c => c.server.id !== id);

      if (remaining.length === 0) {
        // Done resolving
        saveQuotesToLocal(base);
        showNotification('All conflicts resolved and saved.');
        renderQuotes();
        window._pendingConflicts = null;
        window._pendingBaseQuotes = null;
      } else {
        // Render remaining
        window._pendingBaseQuotes = base;
        window._pendingConflicts = remaining;
        renderConflicts(remaining, base);
      }
    }

    // Periodic fetching
    async function fetchQuotesFromServer() {
      try {
        const res = await fetch(API_URL);
        const serverQuotes = await res.json();
        updateLocalStorage(serverQuotes);
      } catch (error) {
        showNotification('Failed to fetch data from server.');
        console.error(error);
      }
    }

    // Init
    fetchQuotesFromServer(); // Initial fetch
    setInterval(fetchQuotesFromServer, FETCH_INTERVAL);