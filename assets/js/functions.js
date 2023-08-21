// Creates contenful connection
var contentful = require('contentful');


var client = contentful.createClient({
  space: '2z4ndwjxg4ws',
  accessToken: 'ATS5PBZP_UXQgvg5lODlPfu_1gpDudoxeiu58XrLEMM',
});

async function getEntries() {
  try {
    const response = await client.getEntries();
    return response.items;
  } catch (error) {
    console.error('Error fetching entry:', error);
    // Handle error appropriately
  }
}

// Generating HTML
function generateHTML(entry, type) {
  const entryTitle = entry.fields.articleName || '';
  const entryTag = entry.fields.articleTags || '';
  const entrySummary = entry.fields.articleSummary || '';
  const entryThumbnail = entry.fields.articleThumbnail?.fields.file.url || '';
  const entryDate = entry.fields.articleDate || '';
  const entryType = entry.fields.articleType || '';

  if (type == "Regular") {
    return `
      <div class="mb-3 d-flex justify-content-between">
        <div class="contentful-article pr-3">
          <h2 class="mb-1 h4 font-weight-bold">
            <a class="text-white text-light" href="./article.html">${entryTitle}</a>
          </h2>
          <p class="text-text">${entrySummary}</p>
          <div class="card-text text-muted small">${entryTag}</div>
          <small class="text-muted">${entryDate}</small>
        </div>
        <div class="pr-3">
          <img src="https:${entryThumbnail}">
        </div>
      </div>
    `;
  } else if (type == "Popular") {
    return `
      <li>
        <span>
          <h6 class="font-weight-bold">
            <a href="./article.html" class="text-white text-light">${entryTitle}</a>
          </h6>
          <p class="text-muted">${entryTag}</p>
        </span>
      </li>
    `;
  }
}

// Inserting into HTML
// Inserting into HTML
async function insertEntries(containerIdRegular, containerIdPopular) {
  const entries = await getEntries();
  const containerRegular = document.getElementById(containerIdRegular);
  const containerPopular = document.getElementById(containerIdPopular);

  let popularCount = 0;

  for (let i = 0; i < entries.length; i++) {
    let entry = entries[i];

    // Generate Regular HTML for every entry
    let htmlRegular = generateHTML(entry, 'Regular');
    containerRegular.innerHTML += htmlRegular;

    // If the entry type is Popular, generate Popular HTML as well
    // and the popularCount is less than 5, add to Popular
    if (entry.fields.articleType.includes('Popular') && popularCount < 5) {
      let htmlPopular = generateHTML(entry, 'Popular');
      containerPopular.innerHTML += htmlPopular;
      popularCount++;
    }
  }
}

insertEntries('contentful-example', 'list-featured');











jQuery( document ).ready(function() {

    $(window).scroll(function(){
    $('.topnav').toggleClass('scrollednav py-0', $(this).scrollTop() > 50);
    });
    
});
