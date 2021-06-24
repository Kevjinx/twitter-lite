const express = require("express");
const router = express.Router()
const { check } = require('express-validator')
const { asyncHandler, handleValidationErrors } = require("../../utils");
const bcrypt = require('bcryptjs')
const {getUserToken} = require('../auth')
const db = require('../db/models')

const validateUsername =
  check("username")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a username");

const validateEmailAndPassword = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a password."),
];

const validationArr = [validateEmailAndPassword, validateUsername, handleValidationErrors]

router.post('/', validationArr, asyncHandler(async (req, res) => {

  const {
    username,
    email,
    password
  } = req.body

  const hashedPassword = await bcrypt.hash(password, 10)

  const newUser = await db.User.create({
    username,
    email,
    hashedPassword
  })

  //returning access jwt token
  const token = getUserToken(newUser)
  res.status(201).json({
    user: { id: newUser.id},
    token
  })
}))


// const testPostNode = async (username, email, password) => {
//   const hashedPassword = await bcrypt.hash(password, 10)

//   const newUser = await db.User.create({
//     username,
//     email,
//     hashedPassword
//   })

//   //returning access jwt token
//   const token = getUserToken(newUser)
//   console.log(token);
//   // res.status(201).json({
//   //   user: { id: newUser.id},
//   //   token
//   // })
// }

// console.log(testPostNode('keadaasdfasdfsdfasdf', 'asllaksasdfsj@gmail.com', 'password'));


module.exports = router;