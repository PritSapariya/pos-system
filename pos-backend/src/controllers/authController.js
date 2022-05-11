const User = require('../models/UserModel')
const jwt = require('jsonwebtoken')

exports.userSignIn = (req, res, next) => {
    
    const { email, password } = req.body 

    User.findOne({ email: email }).exec((error, user) => {

      if(error) {
        return res.status(400).json({ status:'error', message: 'Internal Server Error' })
      }
      if(user) {

        if(user.authenticate(password)) {
          const token = jwt.sign({_id: user._id, role: user.role}, process.env.JWT_SECRET, { expiresIn: '1h' });
          const { firstName, lastName, role, email, fullName } = user;
          return res.status(200).json({
            status: 'ok',
            token, 
            user: {
              firstName, lastName, role, fullName, email
            }
          })  
        }
        else {
          return res.status(400).json({ status: 'error', message: 'Invalid Password' })
        }
        
      } else {
        return res.status(401).json({ status: 'error', message: "User is not registered yet!" })
      }
    })

}

exports.userSignUp = (req, res, next) => {

  const { firstName, lastName, email, password } = req.body 
  
  User.findOne({ email: req.body.email }).exec((error, user) => {

    if(error) {
      return res.status(500).json({ status: 'error', message: 'Internal Server Error', errorData: error })
    }
    if(user) {
      return res.status(208).json({ status: 'error', message: 'Email is already registered!!' })
    } 

    const _user = new User({ firstName, lastName, email, password })
    _user.save((error, data) => {
      if(error) {
        return res.status(500).json({ status: 'error', message: "Internal Server Error", errorData : error})
      }
      return res.status(201).json({ status: 'ok', message: "User is registered successfully!" })
    })


  })

}

exports.requireSignIn = (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
    if(err) {
      res.status(400).json({ status: 'error', message: 'Token is not valid'})
    } else {
      req.role = decodedToken.role
      next();
    }
  });
}

exports.validateUser = (req, res, next) => {
  if(req.role == 'user') {
    next();
  } else {
    res.status(401).json({ status: 'error', message: 'You are not allowed to access only users can access it' })
  }
}

exports.validateAdmin = (req, res, next) => {
  if(req.role == 'admin') {
    next();
  } else {
    res.status(401).json({ status: 'error', message: 'You are not allowed to access only admin can access it' })
  }
}

exports.temp = (req, res, next) => {
  res.status(200).json({ status: 'ok',  message: "You are accesing user's protectced route", role: req.role })
}

