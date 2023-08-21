// Creates contenful connection
var contentful = require('contentful');


var client = contentful.createClient({
  space: '2z4ndwjxg4ws',
  accessToken: 'ATS5PBZP_UXQgvg5lODlPfu_1gpDudoxeiu58XrLEMM',
});

var contentContainer = document.getElementById('contentful-example');


// Creates the HTML for regular articles
function generateRegularHTML(entry) {
  const entryTitle = entry.fields.articleName || '';
  const entrySummary = entry.fields.articleSummary || '';
  const entryThumbnail = entry.fields.articleThumbnail?.fields.file.url || '';
  const entryTag = entry.fields.articleTags || '';
  const entryDate = entry.fields.articleDate || '';

  const entryTitleHTML = `<h2 class="mb-1 h4 font-weight-bold"><a class="text-white text-light" href="./article.html">${entryTitle}</a></h2>`;
  const entrySummaryHTML = `<p class="text-text">${entrySummary}</p>`;
  const entryThumbnailHTML = `<img src="https:${entryThumbnail}">`;
  const entryTagHTML = `<div class="card-text text-muted small">${entryTag}</div>`;
  const entryDateHTML = `<small class="text-muted">${entryDate}</small>`;

  const containerDiv = document.createElement('div');
  containerDiv.className = 'mb-3 d-flex justify-content-between'
  
  const entryDiv = document.createElement('div');
  entryDiv.className = 'contentful-article pr-3';
  entryDiv.innerHTML = entryTitleHTML + entrySummaryHTML + entryTagHTML + entryDateHTML;

  const thumbnailDiv = document.createElement('div');
  thumbnailDiv.className = "pr-3"
  thumbnailDiv.innerHTML = entryThumbnailHTML
  
  containerDiv.appendChild(entryDiv)
  containerDiv.appendChild(thumbnailDiv)

  return containerDiv;
}

function generatePopularHTML(entry) {
  const entryTitle = entry.fields.articleName || '';
  const entryTag = entry.fields.articleTags || '';

  const entryTitleHTML = `<a href="./article.html" class="text-white text-light"> ${entryTitle}</a>`
  const entryTagHTML = `<p class="text-muted">${entryTag}</p>`

  const listItem = document.createElement('li');
  listItem.innerHTML = '<span><h6 class="font-weight-bold">' + entryTitleHTML + '</h6>' + entryTagHTML + '</span'

  return listItem;

}





// takes generated HTML and inserts it into html
function getEntries() {
  client.getEntries()
    .then((response) => {
      response.items.forEach((entry) => {
        const containerDiv = generateRegularHTML(entry);
        contentContainer.appendChild(containerDiv);
      })
    })
    .catch(function (error) {
      console.error('Error fetching entry:', error);
    });
}


function getPopularEntries() {
  client.getEntries()
    .then((response) => {
      response.items.forEach((entry) => {
        if (entry.fields.articleType.includes("Popular")) {
        const listItem = generatePopularHTML(entry);
        var listContainer = document.getElementById('list-featured');
        listContainer.appendChild(listItem);
      }
    })
  })
    .catch(function (error) {
      console.error('Error fetching entry:', error);
    });
}


getEntries();
getPopularEntries();






jQuery( document ).ready(function() {

    $(window).scroll(function(){
    $('.topnav').toggleClass('scrollednav py-0', $(this).scrollTop() > 50);
    });
    
});
