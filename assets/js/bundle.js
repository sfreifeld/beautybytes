(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
// Creates contenful connection

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



async function fetchArticleContent(articleId) {
  try {
    const entries = await client.getEntries({
      'sys.id': articleId
    });

    if (entries.items.length > 0) {
      const articleData = entries.items[0];
      const entryTitle = articleData.fields.articleName || '';
      const entryTitleElement = document.getElementById('article-title');
      const entrySummary = articleData.fields.articleSummary || '';
      const entrySummaryElement = document.getElementById('article-summary');
      const entryThumbnail = articleData.fields.articleThumbnail?.fields.file.url || '';
      const entryAlt = articleData.fields.articleAlt || '';
      const entryThumbnailElement = document.getElementById('article-thumbnail');
      const entryDate = articleData.fields.articleDate || '';
      const entryDateElement = document.getElementById('article-date');
      const articleContentElement = document.getElementById('article-content');
    
      entryTitleElement.innerHTML = entryTitle;
      entrySummaryElement.innerHTML = entrySummary;
      entryThumbnailElement.src = "https:" + entryThumbnail;
      entryThumbnailElement.alt = entryAlt;
      entryDateElement.innerHTML = entryDate;
      
      let articleContent = '';
      for (let paragraph of articleData.fields.articleContent.content) {
        if (paragraph.content) { // Check if the content property exists
          for (let textNode of paragraph.content) { 
            articleContent += textNode.value;
          }
          articleContent += '<br><br>'; // Add a line break between paragraphs
        }
      }
    
      articleContentElement.innerHTML = articleContent;
      document.title = entryTitle;

    } else {
      console.error('No article found for the given ID');
    }
  } catch (error) {
    console.error('Error fetching article content:', error);
  }
}


async function fetchPopularArticles() {
  try {
    const entries = await client.getEntries();
    const popularEntries = entries.items.filter(entry => entry.fields.articleType.includes('Popular'));
    popularEntries.sort((a, b) => new Date(b.fields.articleDate) - new Date(a.fields.articleDate));
    const popularArticles = popularEntries.slice(0, 4);

    const firstArticle = popularArticles[0];
    const otherArticles = popularArticles.slice(1);

    const htmlFirstArticle =  `
          <div style="background-image: url(./assets/img/background3.webp); height: 150px; background-size: cover; background-repeat: no-repeat;">
				  </div>
				  <div class="card-body px-0 pb-0 d-flex flex-column align-items-start">
					<h2 class="h4 font-weight-bold">
					<a class="text-white article-link" href="./article.html?id=${firstArticle.sys.id}">${firstArticle.fields.articleName}</a>
					</h2>
					<p class="text-text">
          ${firstArticle.fields.articleSummary}
					</p>
					<div>
						<small class="text-text">${firstArticle.fields.articleDate}</small>
					</div>
				</div>
        `;
    const htmlOtherArticles = otherArticles.map(article => `
        <div class="mb-3 d-flex align-items-center">
        <img height="80" src="https:${article.fields.articleThumbnail.fields.file.url}" alt="${article.fields.articleAlt}">
        <div class="pl-3">
          <h2 class="mb-2 h6 font-weight-bold">
          <a class="text-light article-link" href="./article.html?id=${article.sys.id}">${article.fields.articleName}</a>
          </h2>
          <div class="text-text text-text small">
          ${article.fields.articleTags}
           </div>
          <small class="text-text">${article.fields.articleDate}</small>
        </div>
      </div>
      `).join('');
      return [htmlFirstArticle, htmlOtherArticles];
  } catch (error) {
    console.error('Error fetching popular articles:', error);
  }
}

async function fetchCategoryArticles(category) {
  try {
    const entries = await client.getEntries({
      content_type: 'article', // Replace with your Content Type ID
      'fields.articleTags': category
    
    });

    // Get the category-title element after the entries have been fetched
    const categoryFeaturedTitle = document.getElementById('category-title-featured');
    const categoryPopularTitle = document.getElementById('category-title-popular');
    const categoryFeatured = document.getElementById('category-featured')
    const categoryPopular = document.getElementById('category-popular')
    const categoryAll = document.getElementById('category-all')

    categoryFeaturedTitle.innerHTML = "Featured in " + category;
    categoryPopularTitle.innerHTML = "Popular in " + category;

    document.title = "Categories - " + category;

    // Check if there are any entries
    if (entries.items.length > 0) {
      // Get the first entry
      for (let i = 0; i < entries.items.length; i++) {
        const entry = entries.items[i];

      // Update the categoryFeatured HTML with the first entry's data
      if (entry.fields.articleType.includes("Featured-Left") || entry.fields.articleType.includes("Featured-Right")) {
      categoryFeatured.innerHTML = 
    `<img class="pt-3"  src="https:${entry.fields.articleThumbnail?.fields.file.url}" style="width: 80%;" alt="${entry.fields.articleAlt}">
    <div class="card-body px-0 pb-0 d-flex flex-column align-items-start">
      <h2 class="h2 font-weight-bold">
      <a class="text-white" href="./article.html?id=${entry.sys.id}">${entry.fields.articleName}</a>
      </h2>
      <p class="text-text">
      ${entry.fields.articleSummary}
      </p>
      <div>
        <small class="text-text">${entry.fields.articleTags}</small>
        <br>
        <small class="text-text">${entry.fields.articleDate}</small>
      </div>
    </div>`;
    break;
      }
    }

    let count = 0;
    for (let i = 0; i < entries.items.length; i++) {
      const entry = entries.items[i];
    
      // Update the categoryFeatured HTML with the first entry's data
      if (entry.fields.articleType.includes("Popular")) {
        categoryPopular.innerHTML += 
        `<li>
        <span>
        <h6 class="font-weight-bold">
        <a href="./article.html?id=${entry.sys.id}" class="text-white">${entry.fields.articleName}</a>
        </h6>
        <p class="text-text">
        ${entry.fields.articleTags}
        </p>
        </span>
        </li>`;
        count++;
        if (count >= 5) {
          break;
        }
      }
    }

    for (let i = 0; i < entries.items.length; i++) {
      const entry = entries.items[i];    

        categoryAll.innerHTML += 
        `<div class="mb-3 d-flex justify-content-between">
        <div class="pr-3">
        <h2 class="mb-1 h4 font-weight-bold">
          <a class="text-white" href="./article.html?id=${entry.sys.id}">${entry.fields.articleName}</a>
        </h2>
        <p class="text-text">
          ${entry.fields.articleSummary}
        </p>
        <div class="text-text text-text small"> ${entry.fields.articleTags}</div>
        <small class="text-text"> ${entry.fields.articleDate}</small>
      </div>
      <img height="120" src="https:${entry.fields.articleThumbnail?.fields.file.url}" alt="${entry.fields.articleAlt}">
      </div>`;
      }

  } else { 
   console.error('No entries found for the given category');
  }
} catch (error) {
  console.error('Error fetching category', error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const category = urlParams.get('category');
  
  // Fetch category articles based on the category from the URL
  fetchCategoryArticles(category);
});




document.addEventListener('DOMContentLoaded', async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const articleId = urlParams.get('id');
  
  // Fetch article content based on the articleId from the Contentful API
  fetchArticleContent(articleId);

  // Fetch and display popular articles
  fetchPopularArticles().then(([htmlFirstArticle, htmlOtherArticles]) => {
    document.getElementById('next-popular-left').innerHTML = htmlFirstArticle;
    document.getElementById('next-popular-right').innerHTML = htmlOtherArticles;
  }).catch(error => {
    console.error('Error setting HTML:', error);
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const articleLinks = document.querySelectorAll('.article-link');
  
  articleLinks.forEach(link => {
    link.addEventListener('click', async (event) => {
      event.preventDefault(); // Prevent the default action
      const articleId = new URL(link.href).searchParams.get('id');
      await fetchArticleContent(articleId);
    });
  });
});



// Generating HTML
function generateHTML(entry, type) {
  const entryId = entry.sys.id;
  const entryTitle = entry.fields.articleName || '';
  const entryTag = entry.fields.articleTags || '';
  const entrySummary = entry.fields.articleSummary || '';
  const entryThumbnail = entry.fields.articleThumbnail?.fields.file.url || '';
  const entryDate = entry.fields.articleDate || '';
  const entryAlt = entry.fields.articleAlt|| '';

  if (type == "Regular") {
    return `
      <div class="mb-3 d-flex justify-content-between">
        <div class="contentful-article pr-3 col-md-7">
          <h2 class="mb-1 h4 font-weight-bold">
            <a class="article-link text-white text-light" href="./article.html?id=${entryId}">${entryTitle}</a>
          </h2>
          <p class="text-text">${entrySummary}</p>
          <div class="card-text text-text small">${entryTag}</div>
          <small class="text-text">${entryDate}</small>
        </div>
        <div class="pr-3">
          <img src="https:${entryThumbnail}" alt="${entryAlt}">
        </div>
      </div>
    `;
  } else if (type == "Popular") {
    return `
      <li>
        <span>
          <h6 class="font-weight-bold">
            <a href="./article.html" class="article-link text-white text-light">${entryTitle}</a>
          </h6>
          <p class="text-text">${entryTag}</p>
        </span>
      </li>
    `;
  } else if (type == "Featured-Left") {
    return `
    <div class="card border-0 mb-4 box-shadow h-xl-300">              
      <div style="background-image: url(./assets/img/background3.webp); height: 150px;    background-size: cover;    background-repeat: no-repeat;"></div>               
      <div class="card-body px-0 pb-0 d-flex flex-column align-items-start">
        <h2 class="h4 font-weight-bold">
          <a class="article-link text-white text-light" href="./article.html?id=${entryId}"> ${entryTitle}</a>
        </h2>
        <p class="text-text">${entrySummary}</p>
      <div>
      <small class="text-text">${entryTag}</small><br>
      <small class="text-text">${entryDate}</small>
        </div>
      </div>
    `
  } else if (type == "Featured-Right") {
    return `
    <div class="mb-3 d-flex align-items-center">
      <img height="80" src="https:${entryThumbnail}" alt="${entryAlt}">
      <div class="pl-3">
        <h2 class="mb-2 h6 font-weight-bold">
          <a class="text-white text-light" href="article.html?id=${entryId}">${entryTitle}</a>
        </h2>
        <div class="card-text text-text small">
        ${entryTag}
      </div>
      <small class="text-text">${entryDate}</small>
    </div>
  </div>`
  }
  
}


async function insertEntries(containerIdRegular, containerIdPopular, containerIdFeaturedLeft, containerIdFeaturedRight) {
  const containerRegular = document.getElementById(containerIdRegular);
  const containerPopular = document.getElementById(containerIdPopular);
  const containerFeaturedLeft = document.getElementById(containerIdFeaturedLeft);
  const containerFeaturedRight = document.getElementById(containerIdFeaturedRight);

  if (!containerRegular || !containerPopular || !containerFeaturedLeft || !containerFeaturedRight) {
    return;
  }
  const entries = await getEntries();

  let popularCount = 0;
  let featuredLeftCount = 0;
  let featuredRightCount = 0;

  for (let i = 0; i < entries.length; i++) {
    let entry = entries[i];

    // Generate Regular HTML for every entry
    let htmlRegular = generateHTML(entry, 'Regular');
    containerRegular.innerHTML += htmlRegular;

    if (entry.fields.articleType.includes('Featured-Left') && featuredLeftCount == 0) {
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

},{}]},{},[1]);
