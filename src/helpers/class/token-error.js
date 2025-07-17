class TokenError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.name = "TokenError";
    this.statusCode = statusCode;
  }
}

export { TokenError };
