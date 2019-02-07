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
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
      if (isValid) {
        return db.select('*').from('user')
          .where('email', '=', req.body.email)
          .then(user => {
            res.json(user[0])
          })
          .catch(err => res.status(400).json('Unable to get user'))
      } else {
        res.status(400).json('Invalid credentials')
      }
    })
    .catch(err => res.status(400).json('Invalid credentials'))
})

app.post('/register', (req, res) => {
  const { name, email, password } = req.body
  const hash = bcrypt.hashSync(password)
  db.transaction(trx => {
    trx.insert({
      hash: hash,
      email: email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
      return trx('users')
        .returning('*')
        .insert({
          email: loginEmail[0],
          name: name,
          joined: new Date()
        })
        .then(user => {
          res.json(user[0])
        })
    })
    .then(trx.commit)
    .catch(trx.rollback)
  })
  .catch(err => res.status(400).json(err))
})

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
