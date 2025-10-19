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
    createAddQuoteForm();
}

const createAddQuoteForm = ()=>{
    const div = document.createElement('div')
    div.innerHTML=`<div>
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button onclick="addQuote()">Add Quote</button>
  </div>`;
  quote_display.appendChild(div)
}