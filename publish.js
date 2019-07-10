var ghpages = require('gh-pages');

ghpages.publish('dist', function(err) {
  // eslint-disable-next-line no-console
  console.log(err);
});
