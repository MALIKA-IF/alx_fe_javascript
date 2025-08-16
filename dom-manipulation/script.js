
const quote =[{Text : "quotes 1" , category : 1},
    {Text : "quotes 2" , category : 2},
    {Text : "quotes 3" , category : 3}

]

function showRandomQuote(){

    const display = document.getElementById("newQuote");

    display.addEventListener('click', () =>{
        console.log(quote);
    })
}

showRandomQuote()