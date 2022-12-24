class CustomError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public publicMessage: string,
    public code?: string
  ) {
    super(message);
  }
}

export default CustomError;
