class ApiError extends Error {
  constructor(status, message, source) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.message = message;
    this.source = source;
  }
  detail() {
    return {
      name: this.name,
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
    };
  }
}

module.exports = ApiError;
