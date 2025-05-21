# Book Review API

A RESTful API for a basic Book Review system built with Node.js and Express.

## Tech Stack

- Node.js with Express.js
- MongoDB (with Mongoose)
- JWT for authentication

## Project Setup

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
   ```
   git clone <repository-url>
   cd book-review-api
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/book_review_api
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   ```

### Running the Application

- Development mode:
  ```
  npm run dev
  ```

- Production mode:
  ```
  npm start
  ```

## API Endpoints

### Authentication

- **POST /api/signup** - Register a new user
  ```
  {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- **POST /api/login** - Authenticate and return a token
  ```
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

### Books

- **POST /api/books** - Add a new book (Authenticated users only)
  ```
  {
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "genre": "Classic",
    "description": "A novel about the American Dream",
    "publishedYear": 1925
  }
  ```

- **GET /api/books** - Get all books
  - Query parameters:
    - `page`: Page number (default: 1)
    - `limit`: Number of books per page (default: 10)
    - `author`: Filter by author name
    - `genre`: Filter by genre

- **GET /api/books/:id** - Get book details by ID
  - Query parameters for reviews pagination:
    - `page`: Page number (default: 1)
    - `limit`: Number of reviews per page (default: 10)

### Reviews

- **POST /api/books/:id/reviews** - Submit a review (Authenticated users only, one review per user per book)
  ```
  {
    "rating": 5,
    "text": "This is an amazing book!"
  }
  ```

- **PUT /api/reviews/:id** - Update your own review
  ```
  {
    "rating": 4,
    "text": "Updated review text"
  }
  ```

- **DELETE /api/reviews/:id** - Delete your own review

### Search

- **GET /api/search** - Search books
  - Query parameters:
    - `title`: Search by title (partial and case-insensitive)
    - `author`: Search by author (partial and case-insensitive)

## Database Schema

### User
- `_id`: ObjectId
- `username`: String (required, unique)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `timestamps`: Created and updated dates

### Book
- `_id`: ObjectId
- `title`: String (required)
- `author`: String (required)
- `genre`: String (required)
- `description`: String (required)
- `publishedYear`: Number
- `reviews`: Array of Review ObjectIds
- `timestamps`: Created and updated dates
- Virtual field: `averageRating`

### Review
- `_id`: ObjectId
- `book`: ObjectId (reference to Book)
- `user`: ObjectId (reference to User)
- `rating`: Number (1-5, required)
- `text`: String (required)
- `timestamps`: Created and updated dates

## Design Decisions

- Used JWT for authentication to maintain stateless API
- Implemented pagination for books and reviews to handle large datasets efficiently
- Created a unique index on book and user in the Review model to ensure one review per user per book
- Used virtual fields for calculated data like average rating
