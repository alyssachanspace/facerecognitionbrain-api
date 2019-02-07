const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const bcrypt = require('bcrypt-nodejs')
const knex = require('knex')

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'alyssachan',
    password : '',
    database : 'smart-brain'
  }
})

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      entries: 0,
      joined: new Date()
    }
  ],
  login: [
    {
      id: '123',
      hash: '$2a$10$nIdgWgM6WKczDlv8x3le8uHO9nZvlvw6RAc8EN.Cn5U2tkADQThoS'
    },
    {
      id: '124',
      hash: '$2a$10$cbL1IhrR7C/uc7rprWW/HePT3pkZx8rVC1zJ.as.RWRyTPvCKVFV.'
    }
  ]
}

app.use(cors())
app.use(bodyParser.json())
app.get('/', (req, res) => res.send('Face Recognition Brain'))

app.post('/signin', (req, res) => {
  (req.body.email === database.users[0].email &&
    bcrypt.compareSync(req.body.password, database.login[0].hash))
    ? res.json(database.users[0])
    : res.status(400).json('access denied')
})

app.post('/register', (req, res) => {
  const { name, email, password } = req.body
  db('users')
    .returning('*')
    .insert({
      name: name,
      email: email,
      joined: new Date()
    })
    .then(user => {
      res.json(user[0])
    })
    .catch(err => res.status(400).json('Unable to register'))
  // db('login')
  //   .insert({
  //     email: email,
  //     hash: bcrypt.hashSync(password)
  //   })
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params
  let found = false
  database.users.map(user => {
    if (user.id === id) {
      found = true
      res.json(user)
    }
  })
  if (!found) {
    res.status(404).json('not found')
  }
})

app.put('/image', (req, res) => {
  const { id } = req.body
  let found = false
  database.users.map(user => {
    if (user.id === id) {
      found = true
      user.entries++
      res.json(user.entries)
    }
  })
  if (!found) {
    res.status(404).json('not found')
  }
})

app.listen(3000, () => {
  console.log('app is running on port 3000')
})
