const inputQuery = document.getElementById('query');
const searchBtn = document.getElementById('searchBtn');
const sortEle = document.getElementById('sort');
const filterEle = document.getElementById('yearFilter');
const eleStatus = document.getElementById('status');
const eleResult = document.getElementById('results');

async function search(query){
    if(!query || query.trim().length < 2){
        eleStatus.textContent = 'Please enter atleast 2 characters!'
        return;
    }

    eleStatus.textContent = 'Searching..';
    eleResult.innerHTML = '';

let currentData = [];

    try {
        const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(query)}&limit=50`;
        const res = await fetch(url);
        if(!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        if(!data?.data?.length){
            eleStatus.textContent = 'No results.';
            return;
        }

        currentData = data.data;
        applyFiltersAndSort();

        eleStatus.textContent = `Found ${data.total || data.data.length} results`;
        eleResult.innerHTML = data.data.map(p => `
            <article class="paper">
                <h3 class="title">${p.title || 'Untitled'}</h3>
                <div class="meta">
                    <span class="tag">${(p.year || '—')}</span>
                    <span class="tag">${(p.citationCount ?? 0)} cit</span>
                </div>
                <p class="abstract">${p.abstract ? p.abstract.slice(0,300) : ''}</p>
            </article>
        `).join('');

    } catch (err) {
        eleStatus.textContent = 'Error fetching results';
        eleResult.innerHTML = `<div class="empty">${err.message}</div>`;
        console.error(err);
    }
}

searchBtn.addEventListener("click", () => search(inputQuery.value));

inputQuery.addEventListener("keypress", (e) => {
  if (e.key == "Enter") search(inputQuery.value);
});
