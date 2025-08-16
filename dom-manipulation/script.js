
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
