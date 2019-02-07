const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const bcrypt = require('bcrypt-nodejs')
const knex = require('knex')

const register = require('./controllers/register')
const signin = require('./controllers/signin')
const profile = require('./controllers/profile')
const image = require('./controllers/image')

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
app.post('/register', register.handleRegister(db, bcrypt))
app.post('/signin', signin.handleSignin(db, bcrypt))
app.get('/profile/:id', profile.handleProfileGet(db))
app.put('/image', image.handleImage(db))
app.post('/imageurl', image.handleApiCall)

app.listen(3000, () => {
  console.log('app is running on port 3000')
})
