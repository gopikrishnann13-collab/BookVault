require('dotenv').config();
const express = require('express');
const bookRoutes = require('./routes/bookRoutes');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const {connectDB} = require('./config/db');

const app = express();

app.use(logger);
app.use(express.json());
app.use('/books', bookRoutes);
app.use(errorHandler);

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
    })
})

