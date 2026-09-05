const books = require('../data/books');

module.exports = {
    getBooks : (req, res) => {
        const {genre, available, author} = req.query;
        var filteredBooks = books;

        if (genre) {
            filteredBooks = filteredBooks.filter(book => book.genre.toLowerCase() === genre.toLowerCase());
        }
        if (available) {
            if (available.toLowerCase() === "true" || available.toLowerCase() === "false") {
                filteredBooks = filteredBooks.filter(book => String(book.available).toLowerCase() === available.toLowerCase());
            } else return res.status(400).json({ error : "Invalid available value"});
        }
        if (author) {
            filteredBooks = filteredBooks.filter(book => book.author.toLowerCase().includes(author.toLowerCase()));
        }

        res.json(filteredBooks);
    },

    getBook : (req, res) => {
        const book = books.find(book => book.id == req.params.id)
        if (!book) res.status(404).json({ error: "Book not found" });
        else res.json(book);
    },

    addBook : (req, res) => {
        const {title, author, genre, year, available} = req.body;
        const currYear = new Date().getFullYear();

        if (typeof title !== "string" || title.trim().length === 0) return res.status(400).json({ error: "Invalid title"});
        if (typeof author !== "string" || author.trim().length === 0) return res.status(400).json({ error: "Invalid author name"});
        if (typeof genre !== "string" || genre.trim().length === 0) return res.status(400).json({ error: "Invalid genre"});
        if (!Number.isInteger(year) || year < 1000 || year > currYear) return res.status(400).json({ error: "Invalid year"});
        if (typeof available !== "boolean") return res.status(400).json({ error: "Available must be boolean"});

        const duplicate = books.some(book => book.title.toLowerCase().trim() === title.toLowerCase().trim() &&
                                             book.author.toLowerCase().trim() === author.toLowerCase().trim() &&
                                             book.year === year);

        if (duplicate) return res.status(400).json({ error : "Duplicate entry"});

        const id = books.length === 0 ? 1 : Math.max(...books.map(book => book.id)) + 1;

        const newBook = {
            id,
            title,
            author,
            genre,
            year,
            available
        }
        books.push(newBook);

        res.status(201).json({
            message : "New book added successfully",
            data : newBook
        });
    },

    updateBook : (req, res) => {
        const {title, author, genre, year, available} = req.body;
        const bookId = parseInt(req.params.id);
        const existingBook = books.find(book => book.id === bookId);
        const currYear = new Date().getFullYear();
        const updates = {};

        if (!existingBook) return res.status(404).json({ error: "book not found" });
        if (title === undefined && author === undefined && genre === undefined && year === undefined && available === undefined) return res.status(400).json({ error: "invalid request"});    
        
        if (title !== undefined) {
            if (typeof title !== "string" || title.trim().length === 0) return res.status(400).json({ error: "Invalid title"});
            Object.assign(updates, {title});
        }
        
        if (author !== undefined) {
            if (typeof author !== "string" || author.trim().length === 0) return res.status(400).json({ error: "Invalid author name"});
            Object.assign(updates, {author});
        }

        if (genre !== undefined) {
            if (typeof genre !== "string" || genre.trim().length === 0) return res.status(400).json({ error: "Invalid genre"});
            Object.assign(updates, {genre});
        }

        if (year !== undefined) {
            if (!Number.isInteger(year) || year < 1000 || year > currYear) return res.status(400).json({ error: "Invalid year"});
            Object.assign(updates, {year});
        }

        if (available !== undefined) {
            if (typeof available !== "boolean") return res.status(400).json({ error: "Available must be boolean"});
            Object.assign(updates, {available});
        }

        const updatedBook = {...existingBook, ...updates};
        
        const duplicate = books.some(book => book !== existingBook && book.title.toLowerCase().trim() === updatedBook.title.toLowerCase().trim() &&
                                             book.author.toLowerCase().trim() === updatedBook.author.toLowerCase().trim() &&
                                             book.year === updatedBook.year);

        if (duplicate) return res.status(400).json({ error : "Duplicate entry"});

        Object.assign(existingBook, updates);
        

        res.status(200).json({
            message : "Book updated successfully",
            data : existingBook
        })
    },

    deleteBook : (req, res) => {
        const id = parseInt(req.params.id);
        const idx = books.findIndex(book => book.id === id);

        if (idx === -1) return res.status(404).json({error : "Book not found"});

        books.splice(idx, 1);

        res.status(200).json({
            message : "Book deleted successfully"
        })
    }
}
