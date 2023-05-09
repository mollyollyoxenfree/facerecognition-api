const express = require('express'); 
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

// const db = knex({
//   client: 'pg',
//   connection: {
//   connectionString : process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false }
//   }
// });

const { Client } = require('pg');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

client.connect();

client.query('SELECT table_schema,table_name FROM information_schema.tables;', (err, res) => {
  if (err) throw err;
  for (let row of res.rows) {
    console.log(JSON.stringify(row));
  }
  client.end();
});

//initialize new express app
const app = express();

app.use(cors());

//express middleware to parse JSON data in order to fetch data from the client
// app.use(express.json()); *for parsing application/json*
// app.use(express.urlencoded({ extended: true })); *for parsing application/x-www-form-urlencoded*

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req, res) => { res.send('successfully loaded') });

app.post('/signin', (req, res) => { signin.handleSignin(req, res, db, bcrypt) });

app.post('/register', (req, res) => { register.handleRegister(req, res, db, saltRounds, bcrypt) });
//dependencies injection:
//injecting dependencies needed by handleRegister

app.get('/profile/:id', (req, res) => { profile.handleProfileGet(req, res, db) });

app.put('/image', (req, res) => { image.handleImage(req, res, db) });

app.post('/imageurl', (req, res) => { image.handleApicall(req, res) });

app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT}`);
});