const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/', (req, res) => {
  const filePath = path.join(__dirname, '..', 'data', 'currencies.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  res.json(data);
});

module.exports = router;
