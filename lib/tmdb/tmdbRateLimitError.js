class TmdbRateLimitError extends Error {
  constructor() {
    super('Maximum TMDB requests rate was exceeded');
    this.name = 'TmdbRateLimitError';
  }
}

module.exports = TmdbRateLimitError;
