const express = require('express');
const { createReview, updateReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/books/:id/reviews', protect, createReview);
router.put('/reviews/:id', protect, updateReview);
router.delete('/reviews/:id', protect, deleteReview);

module.exports = router;
