const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');


module.exports = {
    getBooks : async (req, res) => {
        try {
            const { title, author, genre, year, available } = req.query;
            const filter = {};

            if (title) filter.title = title.trim();
            if (author) filter.author = author.trim();
            if (genre) filter.genre = genre.trim();
            if (year) {
                const parsedYear = Number(year.trim());
                if (!Number.isNaN(parsedYear)) filter.year = parsedYear;
                else return res.status(400).json({ error: "Invalid year parameter"}); 
            }
            if (available !== undefined) {
                if (available.trim().toLowerCase() === "true") filter.available = true;
                else if (available.trim().toLowerCase() === "false") filter.available = false;
                else return res.status(400).json({error: "Invalid available parameter"})
            }

            const db = getDB();
            const books = await db.collection('books').find(filter).collation({locale: "en", strength: 2}).toArray();

            return res.status(200).json(books);
        } catch (err) {
            return res.status(500).json({ error : "Could not fetch documents"});
        }        
    },

    getBook : async (req, res) => {
        try {
            if (ObjectId.isValid(req.params.id)) {
                const db = getDB();
                const book = await db.collection('books').findOne({ _id: new ObjectId(req.params.id)});

                if (book) return res.status(200).json(book);
                
                return res.status(404).json({ error: "Book not found"});
            } else return res.status(400).json({ error: "Invalid ID"});
        } catch (err) {
            return res.status(500).json({ error : "Could not fetch document"});
        }
    },

    addBook : async (req, res) => {
        try {
            const db = getDB();
            const {title, author, genre, year, available} = req.body;
            const currYear = new Date().getFullYear();

            if (typeof title !== "string" || title.trim().length === 0) return res.status(400).json({ error: "Invalid title"});
            if (typeof author !== "string" || author.trim().length === 0) return res.status(400).json({ error: "Invalid author name"});
            if (typeof genre !== "string" || genre.trim().length === 0) return res.status(400).json({ error: "Invalid genre"});
            if (!Number.isInteger(year) || year < 1000 || year > currYear) return res.status(400).json({ error: "Invalid year"});
            if (typeof available !== "boolean") return res.status(400).json({ error: "Available must be boolean"});

            const newBook = {
                    title: title.trim(),
                    author: author.trim(),
                    genre: genre.trim(),
                    year,
                    available
                };

            const result = await db.collection('books').insertOne(newBook);

            return res.status(201).json({
                message: "New book added successfully",
                data: {
                    _id: result.insertedId,
                    ...newBook
                }
            });
        } catch (err) {
            if (err.code === 11000) {
                return res.status(409).json({error: "Duplicate entry"});
            }

            return res.status(500).json({error: "Could not add new book"});
        }
    },

    updateBook : async (req, res) => {
        try {
            if (ObjectId.isValid(req.params.id)) {
                const db = getDB();
                const {title, author, genre, year, available} = req.body;
                const currYear = new Date().getFullYear();
                const updates = {};

                if (title === undefined && author === undefined && genre === undefined && year === undefined && available === undefined) return res.status(400).json({ error: "Invalid request"});    
                
                if (title !== undefined) {
                    if (typeof title !== "string" || title.trim().length === 0) return res.status(400).json({ error: "Invalid title"});
                    updates.title = title.trim();
                }
                
                if (author !== undefined) {
                    if (typeof author !== "string" || author.trim().length === 0) return res.status(400).json({ error: "Invalid author name"});
                    updates.author = author.trim();
                }

                if (genre !== undefined) {
                    if (typeof genre !== "string" || genre.trim().length === 0) return res.status(400).json({ error: "Invalid genre"});
                    updates.genre = genre.trim();
                }

                if (year !== undefined) {
                    if (!Number.isInteger(year) || year < 1000 || year > currYear) return res.status(400).json({ error: "Invalid year"});
                    updates.year = year;
                }

                if (available !== undefined) {
                    if (typeof available !== "boolean") return res.status(400).json({ error: "Available must be boolean"});
                    updates.available = available;
                }

                const result = await db.collection('books').updateOne({_id : new ObjectId(req.params.id)}, { $set: updates});

                if (result.matchedCount === 0) return res.status(404).json({error : "Book not found"});

                return res.status(200).json({ message : "Book updated successfully" });
            } else return res.status(400).json({error : "Invalid ID"});
        } catch (err) {
            if (err.code === 11000) return res.status(409).json({error: "Requested changes will create a duplicate entry"});

            res.status(500).json({error : "Could not update book"});
        }
    },

    deleteBook : async (req, res) => {
        try {
            if (ObjectId.isValid(req.params.id)) {
                const db = getDB();
                const result = await db.collection('books').deleteOne({ _id: new ObjectId(req.params.id)});

                if (result.deletedCount === 0) return res.status(404).json({error: "Book not found"});
                
                return res.status(204).send();
            } else return res.status(400).json({error: "Invalid ID"});
        } catch (err) {
            return res.status(500).json({error : "Could not delete document"});
        }
    }
}
