const express = require('express');
const { searchBooks } = require('../controllers/bookController');

const router = express.Router();

router.get('/', searchBooks);

module.exports = router;
