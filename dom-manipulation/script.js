const randomQuotes  =[
  {quote: "Nobody knows tommorow", category: "motivation"},
  {quote: "Things fall apart", category: "struggle"},
  {quote: "In the chest of a woman", category: "education"},
  {quote: "I and my father are one", category: "church"}
];

document.addEventListener('DOMContentLoaded', ()=>{
  showRandomQuote();
  populateCategories();
  restoreLastCategory();
});

const quote_display = document.getElementById("quoteDisplay");
const new_quote = document.getElementById('newQuote');
const exportBtn = document.getElementById('exportQuote');
const categoryFilter = document.getElementById('categoryFilter');
new_quote.addEventListener('click', showRandomQuote);
exportBtn.addEventListener('click', exportQuotesToJSON);
categoryFilter.addEventListener('change', filterQuotes);

function showRandomQuote(){
  let storedQuotes = [];

  for(let i=0; i<localStorage.length; i++){
      const key = localStorage.key(i)
      if(key.startsWith("quote_")){
          const data = JSON.parse(localStorage.getItem(key) || "[]");
          storedQuotes.push(...data);
      }
  }

  const allQuotes = randomQuotes.concat(storedQuotes);
  const randomIndex = Math.floor(Math.random() * allQuotes.length);
  const selectedQuote = allQuotes[randomIndex];

  quote_display.innerHTML="";
  const text = document.createElement('p');
  text.textContent = `${selectedQuote.quote} — ${selectedQuote.category}`;
  quote_display.appendChild(text);

  createAddQuoteForm();
}

const createAddQuoteForm = ()=>{
  const div = document.createElement('div')
  div.innerHTML=`
    <div>
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
      <button onclick="addQuote()">Add Quote</button>
    </div>`;
  quote_display.appendChild(div);
};

function addQuote(){
  const userQuoteText = newQuoteText.value.trim();
  const userQuoteCat = newQuoteCategory.value.trim();

  if(userQuoteCat==="" || userQuoteText===""){
      alert("please enter both quote and category");
      return;
  }

  let myObj ={
      quote: userQuoteText,
      category: userQuoteCat
  };
  randomQuotes.push(myObj);

  const key = `quote_${Date.now()}`;
  localStorage.setItem(key, JSON.stringify(randomQuotes));

  // ✅ Update dropdown if new category introduced
  const categoryExists = Array.from(categoryFilter.options)
                              .some(opt => opt.value === userQuoteCat);
  if(!categoryExists){
      const option = document.createElement('option');
      option.value = userQuoteCat;
      option.textContent = userQuoteCat;
      categoryFilter.appendChild(option);
  }

  newQuoteText.value="";
  newQuoteCategory.value="";
}

function exportQuotesToJSON() {
  // Collect all quotes (default + stored)
  let allQuotes = [...randomQuotes];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith("quote_")) {
      const quotesArray = JSON.parse(localStorage.getItem(key)) || [];
      allQuotes = allQuotes.concat(quotesArray);
    }
  }

  // Convert to JSON
  const jsonData = JSON.stringify(allQuotes, null, 2);

  // Create Blob
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  // Create hidden link
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  document.body.appendChild(a);
  a.click();

  // Cleanup
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    randomQuotes.push(...importedQuotes);

    // ✅ Save imported quotes in localStorage
    const key = `quote_${Date.now()}`;
    localStorage.setItem(key, JSON.stringify(importedQuotes));

    populateCategories(); // Update dropdown
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

/* ✅ Step 2: Populate categories dynamically */
function populateCategories() {
  const allQuotes = [...randomQuotes];
  for(let i=0; i<localStorage.length; i++){
    const key = localStorage.key(i);
    if(key.startsWith("quote_")){
      const stored = JSON.parse(localStorage.getItem(key) || "[]");
      allQuotes.push(...stored);
    }
  }

  // Extract unique categories
  const categories = [...new Set(allQuotes.map(q => q.category))];
  categoryFilter.innerHTML = `<option value="all">All Categories</option>`;
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

/* ✅ Step 2: Filter quotes by category */
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem('lastCategory', selectedCategory); // Remember filter

  let storedQuotes = [];
  for(let i=0; i<localStorage.length; i++){
    const key = localStorage.key(i);
    if(key.startsWith("quote_")){
      const data = JSON.parse(localStorage.getItem(key) || "[]");
      storedQuotes.push(...data);
    }
  }

  const allQuotes = randomQuotes.concat(storedQuotes);
  let filteredQuotes = selectedCategory === "all" 
                        ? allQuotes 
                        : allQuotes.filter(q => q.category === selectedCategory);

  quote_display.innerHTML = "";

  if(filteredQuotes.length === 0){
    quote_display.textContent = "No quotes found for this category.";
    return;
  }

  filteredQuotes.forEach(q => {
    const p = document.createElement('p');
    p.textContent = `${q.quote} — ${q.category}`;
    quote_display.appendChild(p);
  });

  createAddQuoteForm();
}

/* ✅ Step 3: Restore last selected category */
function restoreLastCategory() {
  const lastCat = localStorage.getItem('lastCategory');
  if(lastCat){
    categoryFilter.value = lastCat;
    filterQuotes();
  }
}
