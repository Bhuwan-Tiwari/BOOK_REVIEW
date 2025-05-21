const Book = require('../models/Book');

const createBook = async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const filter = {};
    
    if (req.query.author) {
      filter.author = { $regex: req.query.author, $options: 'i' };
    }
    
    if (req.query.genre) {
      filter.genre = { $regex: req.query.genre, $options: 'i' };
    }
    
    const books = await Book.find(filter)
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'reviews',
        select: 'rating'
      });
    
    const total = await Book.countDocuments(filter);
    
    res.json({
      books,
      page,
      pages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id)
      .populate({
        path: 'reviews',
        select: 'rating text user',
        populate: {
          path: 'user',
          select: 'username'
        },
        options: {
          sort: { createdAt: -1 },
          limit: parseInt(req.query.limit) || 10,
          skip: ((parseInt(req.query.page) || 1) - 1) * (parseInt(req.query.limit) || 10)
        }
      });
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    const totalReviews = await book.reviews.length;
    
    res.json({
      ...book._doc,
      reviewsCount: totalReviews,
      reviewsPage: parseInt(req.query.page) || 1,
      reviewsPages: Math.ceil(totalReviews / (parseInt(req.query.limit) || 10))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchBooks = async (req, res) => {
  try {
    const searchQuery = {};
    
    if (req.query.title) {
      searchQuery.title = { $regex: req.query.title, $options: 'i' };
    }
    
    if (req.query.author) {
      searchQuery.author = { $regex: req.query.author, $options: 'i' };
    }
    
    if (Object.keys(searchQuery).length === 0) {
      return res.status(400).json({ message: 'Please provide a search term' });
    }
    
    const books = await Book.find(searchQuery);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBook,
  getBooks,
  getBookById,
  searchBooks
};
