class PropertyError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.name = "PropertyError";
    this.statusCode = statusCode;
  }
}

export { PropertyError };
