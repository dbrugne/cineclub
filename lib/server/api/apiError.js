class ApiError extends Error {
  constructor(status, message, source) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.message = message;
    this.source = source;
  }
}

module.exports = ApiError;
