console.log("Script loaded successfully");

const inputQuery = document.getElementById("query");
const searchBtn = document.getElementById("searchBtn");
const sortEle = document.getElementById("sort");
const filterEle = document.getElementById("yearFilter");
const eleStatus = document.getElementById("status");
const eleResult = document.getElementById("results");

console.log("All elements found:", {
  inputQuery: !!inputQuery,
  searchBtn: !!searchBtn,
  sortEle: !!sortEle,
  filterEle: !!filterEle,
  eleStatus: !!eleStatus,
  eleResult: !!eleResult,
});

let currentData = [];

async function search(query) {
  console.log("Search called with query:", query);

  if (!query || query.trim().length < 2) {
    eleStatus.textContent = "Please enter at least 2 characters!";
    return;
  }

  eleStatus.textContent = "Searching...";
  eleResult.innerHTML = "";

  try {
    const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(
      query
    )}&fields=title,year,abstract,citationCount,url,externalIds&limit=10`;

    console.log("Fetching URL:", url);

    const res = await fetch(url);
    console.log("Response status:", res.status);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    console.log("Data received:", data);

    if (!data?.data?.length) {
      eleStatus.textContent = "No results found.";
      eleResult.innerHTML =
        '<div class="empty">No papers found. Try different keywords.</div>';
      return;
    }

    currentData = data.data;
    console.log("Current data length:", currentData.length);
    applyFiltersAndSort();
  } catch (err) {
    console.error("Error:", err);
    eleStatus.textContent = "Error fetching results";
    eleResult.innerHTML = `<div class="empty">Error: ${err.message}</div>`;
  }
}

function applyFiltersAndSort() {
  console.log("Applying filters and sort");
  let filtered = [...currentData];

  const yearFilter = parseInt(filterEle.value);
  if (!isNaN(yearFilter)) {
    console.log("Filtering by year:", yearFilter);
    filtered = filtered.filter((p) => p.year && p.year >= yearFilter);
  }

  const sortMethod = sortEle.value;
  console.log("Sorting by:", sortMethod);

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
  console.log("Displaying results:", papers.length);
  eleStatus.textContent = `Found ${papers.length} results`;

  if (papers.length === 0) {
    eleResult.innerHTML =
      '<div class="empty">No papers match your filters.</div>';
    return;
  }

  eleResult.innerHTML = papers
    .map((p) => {
      const paperUrl =
        p.url ||
        (p.externalIds?.DOI ? `https://doi.org/${p.externalIds.DOI}` : null) ||
        (p.externalIds?.ArXiv
          ? `https://arxiv.org/abs/${p.externalIds.ArXiv}`
          : null);

      return `
              <article class="paper" ${
                paperUrl ? `onclick="window.open('${paperUrl}', '_blank')"` : ""
              }>
                <h3 class="title">${p.title || "Untitled"}</h3>
                <div class="meta">
                  <span class="tag">${p.year || "—"}</span>
                  <span class="tag">${p.citationCount ?? 0} citations</span>
                  ${
                    paperUrl
                      ? '<span class="tag" style="background: #10b981;">📄 View Paper</span>'
                      : ""
                  }
                </div>
                <p class="abstract">${
                  p.abstract
                    ? p.abstract.slice(0, 300) + "..."
                    : "No abstract available."
                }</p>
              </article>
            `;
    })
    .join("");
}

searchBtn.addEventListener("click", () => {
  console.log("Search button clicked");
  search(inputQuery.value);
});

inputQuery.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    console.log("Enter key pressed");
    search(inputQuery.value);
  }
});

sortEle.addEventListener("change", () => {
  console.log("Sort changed");
  applyFiltersAndSort();
});

filterEle.addEventListener("input", () => {
  console.log("Filter changed");
  applyFiltersAndSort();
});

console.log("All event listeners attached");