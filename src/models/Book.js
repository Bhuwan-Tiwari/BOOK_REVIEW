const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Book title is required'],
    trim: true
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    trim: true
  },
  genre: {
    type: String,
    required: [true, 'Genre is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Book description is required']
  },
  publishedYear: {
    type: Number
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});


bookSchema.virtual('averageRating').get(function() {
  if (this.reviews && this.reviews.length === 0) return 0;


  if (!this.reviews[0].rating) return 0;

  const sum = this.reviews.reduce((total, review) => total + review.rating, 0);
  return (sum / this.reviews.length).toFixed(1);
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
