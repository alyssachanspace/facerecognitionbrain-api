const express = require('express')

const app = express()

const database = {
  users: [
    {
      id: '123',
      name: 'John',
      email: 'john@gmail.com',
      password: 'cookies',
      entries: 0,
      joined: new Date()
    },
    {
      id: '124',
      name: 'Sally',
      email: 'sally@gmail.com',
      password: 'bananas',
      entries: 0,
      joined: new Date()
    }
  ]
}

app.get('/', (req, res) => {
  res.send('this is working')
})

app.post('/signin', (req, res) => {
  res.json('signing in')
})

app.listen(3000, () => {
  console.log('app is running on port 3000')
})

/*

  Required endpoints:
  / --> res = this is working
  /signin --> POST = success/fail
  /register --> POST = user
  /profile/:userID --> GET = user
  /image --> PUT --> user

 */