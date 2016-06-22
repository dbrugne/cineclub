const { Router } = require('express');
const router = new Router();

router.get('/', (req, res) => res.redirect('/app/'));

router.get('/app*', (req, res) => {
  const scripts = [];
  if (process.env.NODE_ENV === 'development') {
    scripts.push('http://localhost:8080/bundles/vendor.js');
    scripts.push('http://localhost:8080/bundles/bundle.js');
  } else {
    scripts.push('/bundles/vendor.js');
    scripts.push('/bundles/bundle.js');
  }

  res.render('index', {
    data: {
      title: 'Ciné-club',
      scripts,
    },
  });
});

module.exports = router;
