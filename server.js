const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const bcrypt = require('bcrypt-nodejs')

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
  secrets: [
    {
      users_id: '123',
      hash: '$2a$10$nIdgWgM6WKczDlv8x3le8uHO9nZvlvw6RAc8EN.Cn5U2tkADQThoS'
    },
    {
      users_id: '124',
      hash: '$2a$10$cbL1IhrR7C/uc7rprWW/HePT3pkZx8rVC1zJ.as.RWRyTPvCKVFV.'
    }
  ]
}

app.use(cors())
app.use(bodyParser.json())
app.get('/', (req, res) => res.send('Face Recognition Brain'))

app.post('/signin', (req, res) => {
  (req.body.email === database.users[0].email &&
    bcrypt.compareSync(req.body.password, database.secrets[0].hash))
    ? res.json(database.users[0])
    : res.status(400).json('access denied')
})

app.post('/register', (req, res) => {
  const { name, email, password } = req.body
  database.users.push({
    id: '125',
    name: name,
    email: email,
    password: bcrypt.hashSync(password),
    entries: 0,
    joined: new Date()
  })
  database.secrets.push({
    users_id: '125',
    hash: bcrypt.hashSync(password)
  })
  res.json(database.users[database.users.length - 1])
  res.json(database.secrets[database.secrets.length - 1])
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
