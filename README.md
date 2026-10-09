# BookVault

BookVault is a RESTful API for managing a collection of books. It is built with Node.js, Express, and MongoDB, and supports creating, retrieving, updating, deleting, filtering, and paginating book records.

## Features

- Create, retrieve, update, and delete books.
- Retrieve a single book by its MongoDB ID.
- Filter books by title, author, genre, publication year, and availability.
- Paginate and sort book listings.
- Validate incoming data and MongoDB IDs.
- Prevent duplicate books using a case-insensitive unique index on title and author.
- Log incoming HTTP requests.

## Tech Stack

- **Node.js**
- **Express 5**
- **MongoDB** using the official MongoDB Node.js driver
- **dotenv** for environment variable configuration

## Project Structure

```text
BookVault/
├── config/
│   └── db.js
├── controllers/
│   └── bookController.js
├── middleware/
│   ├── errorHandler.js
│   └── logger.js
├── routes/
│   └── bookRoutes.js
├── index.js
├── package.json
└── .gitignore
```

## Getting Started

### Prerequisites

- Node.js (version 20.19.0 or later, as required by the installed MongoDB driver)
- npm
- A running MongoDB instance, local or hosted

### 1. Clone the repository

```bash
git clone https://github.com/gopikrishnann13-collab/BookVault.git
cd BookVault
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017
```

Update `MONGODB_URI` to match your MongoDB connection string. For a local MongoDB setup, make sure the MongoDB server is running. You can use MongoDB Compass to inspect the database and its collections.

The application connects to the `booksDB` database and uses the `books` collection.

### 4. Start the server

```bash
node index.js
```

The server starts on the port specified by `PORT` after the database connection succeeds. With the example configuration, the API base URL is:

```text
http://localhost:3000
```

## API Endpoints

All endpoints are prefixed with `/books`.

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/books` | Retrieve a filtered, sorted, paginated list of books |
| `GET` | `/books/:id` | Retrieve a book by ID |
| `POST` | `/books` | Add a new book |
| `PATCH` | `/books/:id` | Update one or more fields of a book |
| `DELETE` | `/books/:id` | Delete a book |

### Book Data Format

A book has the following fields:

```json
{
  "title": "The Hobbit",
  "author": "J. R. R. Tolkien",
  "genre": "Fantasy",
  "year": 1937,
  "available": true
}
```

- `title`: non-empty string
- `author`: non-empty string
- `genre`: non-empty string
- `year`: integer between 1000 and the current year
- `available`: boolean (`true` or `false`)

MongoDB generates an `_id` for each book.

### Examples

#### Add a book

`POST /books`

Send a JSON request body:

```json
{
  "title": "The Hobbit",
  "author": "J. R. R. Tolkien",
  "genre": "Fantasy",
  "year": 1937,
  "available": true
}
```

A successful request returns `201 Created` with a success message and the created book data.

#### Get all books

`GET /books`

The list is sorted by title in ascending, case-insensitive order. By default, the endpoint returns up to five books per page, starting at page 1.

#### Filter and paginate books

`GET /books?genre=Fantasy&available=true&page=1&limit=5`

Supported query parameters:

| Parameter | Description |
| --- | --- |
| `title` | Filter by exact title |
| `author` | Filter by exact author |
| `genre` | Filter by exact genre |
| `year` | Filter by publication year |
| `available` | Filter by `true` or `false` |
| `page` | Page number; defaults to `1` |
| `limit` | Number of results per page; defaults to `5` |

Text filters use exact matching, with case-insensitive collation. The `year`, `page`, and `limit` parameters must contain valid numeric values; `page` and `limit` must be positive integers.

#### Get a book by ID

`GET /books/:id`

Replace `:id` with the book's MongoDB `_id`.

#### Update a book

`PATCH /books/:id`

Include only the fields to change. For example:

```json
{
  "available": false
}
```

#### Delete a book

`DELETE /books/:id`

A successful deletion returns `204 No Content`.

## Error Handling

The API uses HTTP status codes to indicate the result of a request. Depending on the endpoint and error, responses may include:

- `400 Bad Request` — invalid input or MongoDB ID
- `404 Not Found` — book does not exist
- `409 Conflict` — duplicate title and author combination
- `500 Internal Server Error` — an unexpected server or database error

Error responses include a JSON object with an `error` message, except for successful deletion, which returns no content.

## Database Notes

- Database: `booksDB`
- Collection: `books`
- A unique compound index on `title` and `author` uses case-insensitive collation to prevent duplicate combinations that differ only by letter case.

## Development Notes

- Keep your `.env` file private; it is excluded through `.gitignore`.
- The project uses the native MongoDB driver and does not require Mongoose.
- The current `package.json` does not define an automated test suite. Test the endpoints with a tool such as Postman or `curl`.

## License

The project currently declares the ISC license in `package.json`.
