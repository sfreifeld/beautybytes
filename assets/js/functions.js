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
      const entryThumbnailElement = document.getElementById('article-thumbnail');
      const entryDate = articleData.fields.articleDate || '';
      const entryDateElement = document.getElementById('article-date');
      const articleContentElement = document.getElementById('article-content');
    
      entryTitleElement.innerHTML = entryTitle;
      entrySummaryElement.innerHTML = entrySummary;
      entryThumbnailElement.src = "https:" + entryThumbnail
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
          <div style="background-image: url(./assets/img/background3.png); height: 150px; background-size: cover; background-repeat: no-repeat;">
				  </div>
				  <div class="card-body px-0 pb-0 d-flex flex-column align-items-start">
					<h2 class="h4 font-weight-bold">
					<a class="text-white article-link" href="./article.html?id=${firstArticle.sys.id}">${firstArticle.fields.articleName}</a>
					</h2>
					<p class="text-text">
          ${firstArticle.fields.articleSummary}
					</p>
					<div>
						<small class="text-muted">${firstArticle.fields.articleDate}</small>
					</div>
				</div>
        `;
    const htmlOtherArticles = otherArticles.map(article => `
        <div class="mb-3 d-flex align-items-center">
        <img height="80" src="https:${article.fields.articleThumbnail.fields.file.url}">
        <div class="pl-3">
          <h2 class="mb-2 h6 font-weight-bold">
          <a class="text-light article-link" href="./article.html?id=${article.sys.id}">${article.fields.articleName}</a>
          </h2>
          <div class="text-text text-muted small">
          ${article.fields.articleTags}
           </div>
          <small class="text-muted">${article.fields.articleDate}</small>
        </div>
      </div>
      `).join('');
      return [htmlFirstArticle, htmlOtherArticles];
  } catch (error) {
    console.error('Error fetching popular articles:', error);
  }
}



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
  const entryType = entry.fields.articleType || '';

  if (type == "Regular") {
    return `
      <div class="mb-3 d-flex justify-content-between">
        <div class="contentful-article pr-3 col-md-7">
          <h2 class="mb-1 h4 font-weight-bold">
            <a class="article-link text-white text-light" href="./article.html?id=${entryId}">${entryTitle}</a>
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
            <a href="./article.html" class="article-link text-white text-light">${entryTitle}</a>
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
          <a class="article-link text-white text-light" href="./article.html?id=${entryId}"> ${entryTitle}</a>
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
          <a class="text-white text-light" href="article.html?id=${entryId}">${entryTitle}</a>
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
