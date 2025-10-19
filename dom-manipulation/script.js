const quote_display = document.getElementById("quoteDisplay");
const new_quote = document.getElementById('newQuote');

const randomQuotes  =[{quote: "Nobody knows tommorow", category: "motivation"},
                    {quote: "Things fall apart", category: "struggle"},
                    {quote: "In the chest of a woman", category: "education"},
                    {quote: "I and my father are one", category: "church"}];

new_quote.addEventListener('click',showRandomQuote);


function showRandomQuote(){
const randomIndex = Math.floor(Math.random() * randomQuotes.length);
  const selectedQuote = randomQuotes[randomIndex];

    quote_display.innerHTML="";
    
    const text = document.createElement('p');
    text.textContent = `${selectedQuote.quote} — ${selectedQuote.category}`;
    quote_display.appendChild(text);

}

