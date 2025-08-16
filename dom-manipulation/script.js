
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