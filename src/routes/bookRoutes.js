const express = require('express');
const { createBook, getBooks, getBookById } = require('../controllers/bookController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, createBook);
router.get('/', getBooks);
router.get('/:id', getBookById);

module.exports = router;
