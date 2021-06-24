const express = require('express')
const { validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const validationErrors = validationResult(req);
  // TODO: Generate error object and invoke next middleware function

  if (!validationErrors.isEmpty()) {
    const errors = validationErrors.array().map((error) => error.msg);
    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    return next(err);
  }
  next();
};

const asyncHandler = (handler) => (req, res, next) => handler(req, res, next).catch(next);

module.exports = { handleValidationErrors, asyncHandler}