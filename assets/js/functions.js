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
  } else if (type == "Featured-Left") {
    return `
    <div class="card border-0 mb-4 box-shadow h-xl-300">              
      <div style="background-image: url(./assets/img/background3.png); height: 150px;    background-size: cover;    background-repeat: no-repeat;"></div>               
      <div class="card-body px-0 pb-0 d-flex flex-column align-items-start">
        <h2 class="h4 font-weight-bold">
          <a class="text-white text-light" href="./article.html"> ${entryTitle}</a>
        </h2>
        <p class="text-text">${entrySummary}</p>
      <div>
      <small class="text-muted">${entryDate}</small>
        </div>
      </div>
    `
  } else if (type == "Featured-Right") {
    return `
    <div class="mb-3 d-flex align-items-center">
      <img height="80" src="https:${entryThumbnail}">
      <div class="pl-3">
        <h2 class="mb-2 h6 font-weight-bold">
          <a class="text-white text-light" href="./article.html">${entryTitle}</a>
        </h2>
        <div class="card-text text-muted small">
        ${entryTag}
      </div>
      <small class="text-muted">${entryDate}</small>
    </div>
  </div>`
  }
  
}


async function insertEntries(containerIdRegular, containerIdPopular, containerIdFeaturedLeft, containerIdFeaturedRight) {
  const entries = await getEntries();
  const containerRegular = document.getElementById(containerIdRegular);
  const containerPopular = document.getElementById(containerIdPopular);
  const containerFeaturedLeft = document.getElementById(containerIdFeaturedLeft);
  const containerFeaturedRight = document.getElementById(containerIdFeaturedRight);



  let popularCount = 0;
  let featuredLeftCount = 0;
  let featuredRightCount = 0;

  for (let i = 0; i < entries.length; i++) {
    let entry = entries[i];

    // Generate Regular HTML for every entry
    let htmlRegular = generateHTML(entry, 'Regular');
    containerRegular.innerHTML += htmlRegular;

    if (entry.fields.articleType.includes('Featured-Left') && featuredLeftCount == 0) {
      console.log('hi')
      let htmlFeaturedLeft = generateHTML(entry, 'Featured-Left');
      containerFeaturedLeft.innerHTML += htmlFeaturedLeft;
      featuredLeftCount++;
    }

    // If the entry type is Popular, generate Popular HTML as well
    // and the popularCount is less than 5, add to Popular
    if (entry.fields.articleType.includes('Popular') && popularCount < 5) {
      let htmlPopular = generateHTML(entry, 'Popular');
      containerPopular.innerHTML += htmlPopular;
      popularCount++;
    }

    if (entry.fields.articleType.includes('Featured-Right') && featuredRightCount < 3) {
      let htmlFeaturedRight = generateHTML(entry, 'Featured-Right');
      containerFeaturedRight.innerHTML += htmlFeaturedRight;
      featuredRightCount++;
    }
  }
}











insertEntries('contentful-example', 'list-featured', 'featuredLeft', 'featuredRight');











jQuery( document ).ready(function() {

    $(window).scroll(function(){
    $('.topnav').toggleClass('scrollednav py-0', $(this).scrollTop() > 50);
    });
    
});
