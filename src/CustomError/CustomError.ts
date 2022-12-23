class CustomError extends Error {
  constructor(
    privateMessage: string,
    public statusCode: number,
    public publicMessage: string
  ) {
    super(privateMessage);
  }
}

export default CustomError;
