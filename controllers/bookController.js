const books = require('../data/books');

module.exports = {
    getBooks : (req, res) => {
        res.json(books);
    },

    getBook : (req, res) => {
        const book = books.find(book => book.id == req.params.id)
        if (!book) res.status(404).json({ error: "Book not found" });
        else res.json(book);
    },

    addBook : (req, res) => {
        const {title, author, genre, year, available} = req.body;
        const currYear = new Date().getFullYear();

        if (typeof title !== "string" || title.trim().length === 0) return res.status(400).json({ error: "invalid title"});
        if (typeof author !== "string" || author.trim().length === 0) return res.status(400).json({ error: "invalid author name"});
        if (typeof genre !== "string" || genre.trim().length === 0) return res.status(400).json({ error: "invalid genre"});
        if (!Number.isInteger(year) || year < 1000 || year > currYear) return res.status(400).json({ error: "invalid year"});
        if (typeof available !== "boolean") return res.status(400).json({ error: "available must be boolean"});

        const duplicate = books.some(book => book.title.toLowerCase().trim() === title.toLowerCase().trim() &&
                                             book.author.toLowerCase().trim() === author.toLowerCase().trim() &&
                                             book.year === year);

        if (duplicate) return res.status(400).json({ error : "duplicate entry"});

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
    }
}
