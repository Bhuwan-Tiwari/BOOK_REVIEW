const Review = require('../models/Review');
const Book = require('../models/Book');

const createReview = async (req, res) => {
  const { rating, text } = req.body;
  const bookId = req.params.id;

  try {
    const book = await Book.findById(bookId);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    const alreadyReviewed = await Review.findOne({
      user: req.user._id,
      book: bookId
    });
    
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }
    
    const review = await Review.create({
      rating,
      text,
      user: req.user._id,
      book: bookId
    });
    
    book.reviews.push(review._id);
    await book.save();
    
    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateReview = async (req, res) => {
  const { rating, text } = req.body;
  
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update your own reviews' });
    }
    
    review.rating = rating || review.rating;
    review.text = text || review.text;
    
    const updatedReview = await review.save();
    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only delete your own reviews' });
    }
    
    await Review.deleteOne({ _id: req.params.id });
    
    const book = await Book.findById(review.book);
    if (book) {
      book.reviews = book.reviews.filter(
        (reviewId) => reviewId.toString() !== req.params.id
      );
      await book.save();
    }
    
    res.json({ message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  updateReview,
  deleteReview
};
