const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  let scripts = [];
  if (process.env.NODE_ENV === 'development') {
    scripts.push('http://localhost:8080/bundles/vendor.js');
    scripts.push('http://localhost:8080/bundles/bundle.js');
  } else {
    scripts.push('/bundles/bundle.js');
  }

  res.render('index', {
    data: {
      title: 'FTP Nanny app',
      scripts,
    },
  });
});

module.exports = router;
