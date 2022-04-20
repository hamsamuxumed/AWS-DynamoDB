const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { checkToken } = require('./verify');
const app = express();

app.use(cors());

const {
    addBook,
    addUser,
    updateBook,
    getBooks,
    deleteBook,
    getBookByTitle,
    getUserByEmail
} = require('./dynamo');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Welcome to the library app');
});


app.post('/register', async (req, res) => {
    const user = req.body.formData;
    console.log(user)
    const id = crypto.randomBytes(6).toString("hex");
    try {
        let salt = await bcrypt.genSalt(10);
        let hash = await bcrypt.hash(user.password, salt);
        await addUser({...user, password: hash, id: id, role: "user" })
        res.status(201).json({msg: 'User created'})
    } catch (err) {
        res.status(500).json({err});
    }
})

app.post('/login', async (req, res) => {
    try {
        const user = req.body.formData;
        const foundUser = await getUserByEmail(user.email)
        console.log(foundUser.Items[0])
        const dbPass = foundUser.Items[0].password;
        const dbFName = foundUser.Items[0].fname;
        const dbLName = foundUser.Items[0].lname;
        const dbRole = foundUser.Items[0].role;
        const enteredPass = user.password;
        if(!foundUser){ throw new Error('No user with this email') }
        const authed = await bcrypt.compare(enteredPass, dbPass)
        if (authed){
            const sendToken = (err, token) => {
                if(err){ throw new Error('Could not create token')}
                res.status(200).json({
                    success: true,
                    token: 'Bearer ' + token
                })
            } 
            const secret = process.env.TOKEN_SECRET;
            const payload = { fname: dbFName, lname: dbLName, role: dbRole }
            jwt.sign(payload, secret, { expiresIn: '1h' }, sendToken)
        } else {
            throw new Error('User could not be authenticated')  
        }
    } catch (err) {
        res.status(401).json({ err });
    }
})

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

app.delete('/books/:id', checkToken, async (req, res) => {
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
        const newBook = await addBook(book);
        res.json(newBook);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});

app.patch('/books/:id', async (req, res) => {
    const book = req.body;
    const { id } = req.params;
    book.id = id;
    try {
        const newBook = await updateBook(book,id);
        res.json(newBook);
    } catch (err) {
        console.error(err);
        res.status(500).json({ err: 'Something went wrong' });
    }
});


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});