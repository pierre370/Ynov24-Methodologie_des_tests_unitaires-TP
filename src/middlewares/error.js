export default function errorMiddleware(err, req, res, next) {
  return res.status(500).send({ message: err.message });
}

// TODO implement error handler on routes
/*
class ConflictError extends Error { // parent error
  constructor(statusCode) {
    super();
    this.statusCode = 418 // error code for responding to client
  }
}

class NotFoundError extends Error { // parent error
  constructor(statusCode) {
    super();
    this.statusCode = 404 // error code for responding to client
  }
}

class ForbiddenError extends Error { // parent error
  constructor(statusCode) {
    super();
    this.statusCode = 403 // error code for responding to client
  }
}

class UnauthorizedError extends Error { // parent error
  constructor(statusCode) {
    super();
    this.statusCode = 401 // error code for responding to client
  }
}

module.exports = {
  ConflictError,
  NotFoundError,
  ForbiddenError,
  UnauthorizedError
}
*/
