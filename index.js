const express = require('express');
const bookRoutes = require('./routes/bookRoutes');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(logger);
app.use(express.json());
app.use('/books', bookRoutes);
app.use(errorHandler);

app.listen(3000, () => {
    console.log("listening on port 3000");
})