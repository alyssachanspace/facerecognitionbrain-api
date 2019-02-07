const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const bcrypt = require('bcrypt-nodejs')
const knex = require('knex')

const signin = require('./controllers/signin')
const register = require('./controllers/register')

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'alyssachan',
    password : '',
    database : 'smart-brain'
  }
})

app.use(cors())
app.use(bodyParser.json())
app.get('/', (req, res) => res.send('Face Recognition Brain'))

app.post('/signin', (req, res) => {signin.handleSignin(req, res, db, bcrypt)})

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params
  db.select('*').from('users').where({id})
    .then(user => {
      user.length
      ? res.json(user[0])
      : res.status(400).json('Not found')
    })
    .catch(err => res.status(400).json('unable to get user'))
})

app.put('/image', (req, res) => {
  const { id } = req.body
  db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => res.json(entries[0]))
    .catch(err => res.status(400).json('unable to get entries'))
})

app.listen(3000, () => {
  console.log('app is running on port 3000')
})
