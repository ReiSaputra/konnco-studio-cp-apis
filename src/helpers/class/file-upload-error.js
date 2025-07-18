class FileUploadError extends Error {
  constructor(message) {
    super(message);
    this.name = "FileUploadError";
  }
  statusCode = 400;
}

export { FileUploadError };