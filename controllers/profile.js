const handleProfileGet = (req, res, db) => {
  const { id } = req.params
  db.select('*').from('users').where({id})
    .then(user => {
      user.length
      ? res.json(user[0])
      : res.status(400).json('Not found')
    })
    .catch(err => res.status(400).json('unable to get user'))
}

module.exports = {
  handleProfileGet
}