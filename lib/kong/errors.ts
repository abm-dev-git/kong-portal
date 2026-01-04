/**
 * Kong Admin API Error Handling
 */

export class KongApiError extends Error {
  public readonly statusCode: number;
  public readonly kongMessage?: string;
  public readonly fields?: Record<string, string>;

  constructor(
    message: string,
    statusCode: number,
    kongMessage?: string,
    fields?: Record<string, string>
  ) {
    super(message);
    this.name = 'KongApiError';
    this.statusCode = statusCode;
    this.kongMessage = kongMessage;
    this.fields = fields;
  }

  static fromResponse(response: Response, body?: unknown): KongApiError {
    const kongBody = body as { message?: string; fields?: Record<string, string> } | undefined;
    const kongMessage = kongBody?.message;
    const fields = kongBody?.fields;

    let message: string;
    switch (response.status) {
      case 400:
        message = 'Invalid request to Kong Admin API';
        break;
      case 401:
        message = 'Unauthorized access to Kong Admin API';
        break;
      case 404:
        message = 'Resource not found in Kong';
        break;
      case 409:
        message = 'Conflict - resource already exists in Kong';
        break;
      case 500:
        message = 'Kong Admin API internal error';
        break;
      default:
        message = `Kong Admin API error: ${response.status}`;
    }

    return new KongApiError(message, response.status, kongMessage, fields);
  }

  static connectionError(error: unknown): KongApiError {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new KongApiError(
      `Failed to connect to Kong Admin API: ${errorMessage}`,
      0,
      errorMessage
    );
  }
}

export class ConsumerNotFoundError extends KongApiError {
  constructor(identifier: string) {
    super(`Consumer not found: ${identifier}`, 404);
    this.name = 'ConsumerNotFoundError';
  }
}

export class KeyAuthNotFoundError extends KongApiError {
  constructor(keyId: string) {
    super(`Key-auth credential not found: ${keyId}`, 404);
    this.name = 'KeyAuthNotFoundError';
  }
}
