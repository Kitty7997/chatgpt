const express = require('express');
const app = express();
const dot = require('dotenv');
dot.config({path: './backend/.env'}).parsed;
const port = process.env.PORT || 1234;
const cors = require('cors');
const router = require('./src/routes/router');
const db = require('./src/db/db');

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());
app.use('',router);

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`App listening on port ${port}!`))