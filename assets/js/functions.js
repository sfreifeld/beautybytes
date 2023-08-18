var contentful = require('contentful');


var client = contentful.createClient({
  space: '2z4ndwjxg4ws',
  accessToken: 'ATS5PBZP_UXQgvg5lODlPfu_1gpDudoxeiu58XrLEMM',
});

var contentContainer = document.getElementById('contentful-example');

client.getEntries()
  .then(function (response) {
    response.items.forEach(function (entry) {
      var entryTitle = entry.fields.articleName;
      var entryDiv = document.createElement('div');
      entryDiv.className = 'class';
      entryDiv.innerHTML = '<h2 class="text-text">' + entryTitle + '</h2>';
      contentContainer.appendChild(entryDiv);
    }
    );


})
.catch(console.error);







jQuery( document ).ready(function() {

    $(window).scroll(function(){
    $('.topnav').toggleClass('scrollednav py-0', $(this).scrollTop() > 50);
    });
    
});
