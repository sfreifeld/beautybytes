var contentful = require('contentful');


var client = contentful.createClient({
  space: '2z4ndwjxg4ws',
  accessToken: 'ATS5PBZP_UXQgvg5lODlPfu_1gpDudoxeiu58XrLEMM',
});

var contentContainer = document.getElementById('contentful-example');

client.getEntry('25jwECAtIuwFDbBDuiFp7V')
  .then(function (entry) {
      var entryTitle = entry.fields.articleName;
      var entryTitleHTML = '<h2 class="mb-1 h4 font-weight-bold"><a class="text-white text-light" href="./article.html">' + entryTitle + '</a></h2>'
      var entrySummary = entry.fields.articleSummary;
      var entrySummaryHTML = '<p class="text-text">' + entrySummary + '</p>'
      var entryThumbnail = entry.fields.articleThumbnail.fields.file.url;
      var entryThumbnailHTML = '<img height="120" src=' + entryThumbnail + '">'
      var entryTag = entry.fields.articleTags;
      var entryTagHTML = '<div class="card-text text-muted small">' + entryTag + '</div>'
      var entryDate = entry.fields.articleDate;
      var entryDateHTML = '<small class="text-muted">' + entryDate + '</small>'
      var entryDiv = document.createElement('div');
      var entryDivThumbnailID = document.getElementById('contentful-thumbnail');
      entryDivThumbnailID.innerHTML = entryThumbnailHTML
      entryDiv.className = 'contentful-article';
      entryDiv.innerHTML = entryTitleHTML + entrySummaryHTML + entryTagHTML + entryDateHTML
      contentContainer.appendChild(entryDiv);

    })
    .catch(function (error) {
      console.error('Error fetching entry:', error);
    });







jQuery( document ).ready(function() {

    $(window).scroll(function(){
    $('.topnav').toggleClass('scrollednav py-0', $(this).scrollTop() > 50);
    });
    
});
