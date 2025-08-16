
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

showRandomQuote()
function createAddQuoteForm() {
    const formContainer = document.getElementById('formContainer');

    // Clear existing form if any
    formContainer.innerHTML = '';

    // Create form elements
    const form = document.createElement('form');

    const textInput = document.createElement('input');
    textInput.type = 'text';
    textInput.placeholder = 'Enter quote text';
    textInput.required = true;

    const categoryInput = document.createElement('input');
    categoryInput.type = 'text';
    categoryInput.placeholder = 'Enter category';
    categoryInput.required = true;

    const submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.textContent = 'Add Quote';

    // Append inputs to form
    form.appendChild(textInput);
    form.appendChild(categoryInput);
    form.appendChild(submitBtn);

    // Handle form submission
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const newQuote = {
            text: textInput.value.trim(),
            category: categoryInput.value.trim()
        };

        // Add to quotes array
        quotes.push(newQuote);

        // Optionally clear form fields
        textInput.value = '';
        categoryInput.value = '';

        alert('Quote added successfully!');
    });

    // Append form to container
    formContainer.appendChild(form);
}

// Attach functions to buttons after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('showQuoteBtn').addEventListener('click', showRandomQuote);
    document.getElementById('addQuoteBtn').addEventListener('click', createAddQuoteForm);
});

createAddQuoteForm()