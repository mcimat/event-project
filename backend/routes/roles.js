const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')

const org = process.env.ORG

// importing data model schemas
const { roles } = require('../models/models')

//Gets all roles in mongodb (not necessary, used for testing)
router.get('/', (req, res, next) => {
  roles
    .find({ org: org }, (error, data) => {
      if (error) {
        return next(error)
      } else {
        return res.json(data)
      }
    })
})

//Login
//Bcrypt intro: https://youtu.be/AzA_LTDoFqY
router.post('/', async (req, res) => {
  //takes username and password entered
  const { username, password } = req.body;

  //sees if username or password is not valid
  try {
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Missing username or password' });
    }

    //finds a role with the same username
    const user = await roles.findOne({ username });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    //bcrypt to compare password entered with password in db
    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }
    //Authentication successful
    return res.status(200).json({ user: user, success: true, message: 'Login successful' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

module.exports = router;