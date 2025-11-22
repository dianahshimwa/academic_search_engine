const inputQuery = document.getElementById("query");
const searchBtn = document.getElementById("searchBtn");
const sortEle = document.getElementById("sort");
const filterEle = document.getElementById("yearFilter");
const eleStatus = document.getElementById("status");
const eleResult = document.getElementById("results");

let currentData = [];

async function search(query) {
  if (!query || query.trim().length < 2) {
    eleStatus.textContent = "Please enter at least 2 characters!";
    return;
  }

  eleStatus.textContent = "Searching...";
  eleResult.innerHTML = "";

  try {
    const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(
      query
    )}&fields=title,year,abstract,citationCount&limit=50`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (!data?.data?.length) {
      eleStatus.textContent = "No results.";
      return;
    }

    currentData = data.data;
    applyFiltersAndSort();
  } catch (err) {
    eleStatus.textContent = "Error fetching results";
    eleResult.innerHTML = `<div class="empty">${err.message}</div>`;
    console.error(err);
  }
}

function applyFiltersAndSort() {
  let filtered = [...currentData];

  const yearFilter = parseInt(filterEle.value);
  if (!isNaN(yearFilter)) {
    filtered = filtered.filter((p) => p.year && p.year >= yearFilter);
  }

  const sortMethod = sortEle.value;
  switch (sortMethod) {
    case "year_desc":
      filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
      break;
    case "year_asc":
      filtered.sort((a, b) => (a.year || 0) - (b.year || 0));
      break;
    case "citations_desc":
      filtered.sort((a, b) => (b.citationCount || 0) - (a.citationCount || 0));
      break;
  }

  displayResults(filtered);
}

function displayResults(papers) {
  eleStatus.textContent = `Found ${papers.length} results`;

  if (papers.length === 0) {
    eleResult.innerHTML =
      '<div class="empty">No papers match your filters.</div>';
    return;
  }

  eleResult.innerHTML = papers
    .map(
      (p) => `
          <article class="paper">
            <h3 class="title">${p.title || "Untitled"}</h3>
            <div class="meta">
              <span class="tag">${p.year || "—"}</span>
              <span class="tag">${p.citationCount ?? 0} citations</span>
            </div>
            <p class="abstract">${
              p.abstract
                ? p.abstract.slice(0, 300) + "..."
                : "No abstract available."
            }</p>
          </article>
        `
    )
    .join("");
}

searchBtn.addEventListener("click", () => search(inputQuery.value));

inputQuery.addEventListener("keypress", (e) => {
  if (e.key === "Enter") search(inputQuery.value);
});

sortEle.addEventListener("change", applyFiltersAndSort);
filterEle.addEventListener("input", applyFiltersAndSort);