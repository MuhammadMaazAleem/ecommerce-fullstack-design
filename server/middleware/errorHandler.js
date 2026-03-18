const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((entry) => entry.message)
      .join(', ');
  }

  if (err.code === 11000) {
    statusCode = 400;
    const keys = Object.keys(err.keyValue || {}).join(', ');
    message = `Duplicate value for: ${keys}`;
  }

  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for ${err.path}`;
  }

  const response = {
    success: false,
    message,
    data: null,
  };

  if (process.env.NODE_ENV !== 'production') {
    response.error = {
      name: err.name,
      details: err.details || null,
    };
  }

  res.status(statusCode).json(response);
};

module.exports = {
  notFound,
  errorHandler,
};
