interface SendValidationEmailParams {
  to: string;
  username: string;
  token: string;
}

interface SendSuppressionEmailParams {
  to: string;
  username: string;
}

export { SendValidationEmailParams, SendSuppressionEmailParams };
