class FileUploadError extends Error {
  constructor(message, statusCode) {
    super(message);

    this.name = "FileUploadError";
    this.statusCode = statusCode;
  }
}

export { FileUploadError };
