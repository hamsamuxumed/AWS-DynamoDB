const express = require('express');
const cors = require('cors')
const app = express();

app.use(cors());

const {
    addOrUpdateBook,
    getBooks,
    deleteBook,
    getBookByTitle,
} = require('./dynamo');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/books', async (req, res) => {
    try {
        const books = await getBooks();
        res.json(books);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

app.get('/books/:title', async (req, res) => {
    const title = req.params.title;
    try {
        const book = await getBookByTitle(title);
        console.log(book);
        res.json(book);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

app.delete('/books/:id', async (req, res) => {
    const { id } = req.params;
    try {
        res.json(await deleteBook(id));
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

app.post('/books', async (req, res) => {
    const book = req.body;
    try {
        const newBook = await addOrUpdateBook(book);
        res.json(newBook);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

app.put('/books/:id', async (req, res) => {
    const book = req.body;
    const { id } = req.params;
    book.id = id;
    try {
        const newBook = await addOrUpdateBook(book);
        res.json(newBook);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port port`);
});