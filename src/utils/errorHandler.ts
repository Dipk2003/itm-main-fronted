// Error handling utility for API services
export interface APIError {
  message: string;
  status?: number;
  code?: string;
  field?: string;
  details?: Record<string, any>;
  timestamp?: string;
}

export interface APIErrorResponse {
  error: string;
  message: string;
  statusCode?: number;
  timestamp?: string;
  path?: string;
  details?: Record<string, any>;
  validationErrors?: Array<{
    field: string;
    message: string;
    rejectedValue?: any;
  }>;
}

export class ServiceError extends Error {
  public status: number;
  public code: string;
  public field?: string;
  public details?: Record<string, any>;
  public timestamp: string;

  constructor(
    message: string,
    status: number = 500,
    code: string = 'UNKNOWN_ERROR',
    field?: string,
    details?: Record<string, any>
  ) {
    super(message);
    this.name = 'ServiceError';
    this.status = status;
    this.code = code;
    this.field = field;
    this.details = details;
    this.timestamp = new Date().toISOString();

    // Ensure the error stack is captured properly
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ServiceError);
    }
  }

  toJSON(): APIError {
    return {
      message: this.message,
      status: this.status,
      code: this.code,
      field: this.field,
      details: this.details,
      timestamp: this.timestamp
    };
  }
}

export class NetworkError extends ServiceError {
  constructor(message: string = 'Network connection failed') {
    super(message, 0, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

export class TimeoutError extends ServiceError {
  constructor(message: string = 'Request timed out') {
    super(message, 408, 'TIMEOUT_ERROR');
    this.name = 'TimeoutError';
  }
}

export class AuthenticationError extends ServiceError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends ServiceError {
  constructor(message: string = 'Access denied') {
    super(message, 403, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

export class ValidationError extends ServiceError {
  public validationErrors: Array<{
    field: string;
    message: string;
    rejectedValue?: any;
  }>;

  constructor(
    message: string,
    validationErrors: Array<{
      field: string;
      message: string;
      rejectedValue?: any;
    }> = []
  ) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    this.validationErrors = validationErrors;
  }

  toJSON(): APIError & { validationErrors: typeof this.validationErrors } {
    return {
      ...super.toJSON(),
      validationErrors: this.validationErrors
    };
  }
}

export class NotFoundError extends ServiceError {
  constructor(message: string = 'Resource not found', resourceType?: string) {
    super(message, 404, 'NOT_FOUND_ERROR');
    this.name = 'NotFoundError';
    if (resourceType) {
      this.details = { resourceType };
    }
  }
}

export class ConflictError extends ServiceError {
  constructor(message: string = 'Resource conflict') {
    super(message, 409, 'CONFLICT_ERROR');
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends ServiceError {
  public retryAfter?: number;

  constructor(message: string = 'Rate limit exceeded', retryAfter?: number) {
    super(message, 429, 'RATE_LIMIT_ERROR');
    this.name = 'RateLimitError';
    this.retryAfter = retryAfter;
    if (retryAfter) {
      this.details = { retryAfter };
    }
  }
}

export class ServerError extends ServiceError {
  constructor(message: string = 'Internal server error') {
    super(message, 500, 'SERVER_ERROR');
    this.name = 'ServerError';
  }
}

export class MaintenanceError extends ServiceError {
  constructor(message: string = 'Service temporarily unavailable') {
    super(message, 503, 'MAINTENANCE_ERROR');
    this.name = 'MaintenanceError';
  }
}

// Error Handler Class
export class ErrorHandler {
  /**
   * Parse API error response and create appropriate error instance
   */
  static parseAPIError(error: any): ServiceError {
    console.error('🔴 API Error:', error);

    // Handle network errors
    if (!error.response && error.request) {
      return new NetworkError('Unable to connect to server. Please check your internet connection.');
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return new TimeoutError('Request timed out. Please try again.');
    }

    // Handle cases where there's no response
    if (!error.response) {
      return new NetworkError(error.message || 'An unknown network error occurred');
    }

    const { status, data } = error.response;
    const errorData: APIErrorResponse = data || {};

    // Extract error message
    const message = errorData.message 
      || errorData.error 
      || error.message 
      || 'An unexpected error occurred';

    // Create specific error types based on status code
    switch (status) {
      case 400:
        if (errorData.validationErrors && errorData.validationErrors.length > 0) {
          return new ValidationError(message, errorData.validationErrors);
        }
        return new ValidationError(message);

      case 401:
        return new AuthenticationError(message);

      case 403:
        return new AuthorizationError(message);

      case 404:
        return new NotFoundError(message);

      case 409:
        return new ConflictError(message);

      case 429:
        const retryAfter = error.response.headers?.['retry-after'];
        return new RateLimitError(message, retryAfter ? parseInt(retryAfter) : undefined);

      case 500:
      case 502:
      case 503:
      case 504:
        if (message.toLowerCase().includes('maintenance')) {
          return new MaintenanceError(message);
        }
        return new ServerError(message);

      default:
        return new ServiceError(
          message,
          status,
          errorData.error || 'UNKNOWN_ERROR',
          undefined,
          errorData.details
        );
    }
  }

  /**
   * Handle error with consistent logging and user-friendly messages
   */
  static handleError(error: any, operation: string = 'operation'): ServiceError {
    const serviceError = this.parseAPIError(error);
    
    // Log detailed error for debugging
    console.group(`❌ Error in ${operation}`);
    console.error('Original error:', error);
    console.error('Parsed error:', serviceError.toJSON());
    console.groupEnd();

    return serviceError;
  }

  /**
   * Get user-friendly error message
   */
  static getUserMessage(error: ServiceError): string {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return 'Unable to connect. Please check your internet connection and try again.';
        
      case 'TIMEOUT_ERROR':
        return 'The request took too long. Please try again.';
        
      case 'AUTHENTICATION_ERROR':
        return 'Please log in to continue.';
        
      case 'AUTHORIZATION_ERROR':
        return 'You do not have permission to perform this action.';
        
      case 'VALIDATION_ERROR':
        if (error instanceof ValidationError && error.validationErrors.length > 0) {
          return error.validationErrors.map(ve => ve.message).join(', ');
        }
        return error.message || 'Please check your input and try again.';
        
      case 'NOT_FOUND_ERROR':
        return 'The requested item could not be found.';
        
      case 'CONFLICT_ERROR':
        return 'This action conflicts with existing data. Please refresh and try again.';
        
      case 'RATE_LIMIT_ERROR':
        const retryAfter = (error as RateLimitError).retryAfter;
        return retryAfter 
          ? `Too many requests. Please wait ${retryAfter} seconds before trying again.`
          : 'Too many requests. Please wait a moment before trying again.';
          
      case 'MAINTENANCE_ERROR':
        return 'Service is temporarily unavailable. Please try again later.';
        
      case 'SERVER_ERROR':
        return 'Something went wrong on our end. Please try again later.';
        
      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  }

  /**
   * Determine if an error is retryable
   */
  static isRetryable(error: ServiceError): boolean {
    const retryableCodes = [
      'NETWORK_ERROR',
      'TIMEOUT_ERROR', 
      'SERVER_ERROR',
      'MAINTENANCE_ERROR'
    ];
    
    return retryableCodes.includes(error.code) || error.status >= 500;
  }

  /**
   * Get retry delay for retryable errors
   */
  static getRetryDelay(error: ServiceError, attempt: number): number {
    if (error instanceof RateLimitError && error.retryAfter) {
      return error.retryAfter * 1000; // Convert to milliseconds
    }

    // Exponential backoff: 1s, 2s, 4s, 8s, 16s (max)
    return Math.min(1000 * Math.pow(2, attempt - 1), 16000);
  }

  /**
   * Create error notification object for UI
   */
  static createNotification(error: ServiceError): {
    type: 'error' | 'warning';
    title: string;
    message: string;
    duration?: number;
    action?: {
      label: string;
      handler: () => void;
    };
  } {
    const message = this.getUserMessage(error);
    
    // Critical errors that need immediate attention
    if (error.code === 'AUTHENTICATION_ERROR') {
      return {
        type: 'error',
        title: 'Authentication Required',
        message,
        duration: 0, // Don't auto-dismiss
        action: {
          label: 'Login',
          handler: () => {
            // Redirect to login - this would be handled by the UI component
            window.location.href = '/login';
          }
        }
      };
    }

    // Network errors that might resolve quickly
    if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT_ERROR') {
      return {
        type: 'warning',
        title: 'Connection Issue',
        message,
        duration: 5000
      };
    }

    // Rate limit errors
    if (error.code === 'RATE_LIMIT_ERROR') {
      return {
        type: 'warning',
        title: 'Please Slow Down',
        message,
        duration: 8000
      };
    }

    // Default error notification
    return {
      type: 'error',
      title: 'Error',
      message,
      duration: 5000
    };
  }
}

// Utility functions for common error handling patterns
export const withErrorHandling = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  operation: string
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await fn(...args);
    } catch (error) {
      throw ErrorHandler.handleError(error, operation);
    }
  };
};

export const withRetry = <T extends any[], R>(
  fn: (...args: T) => Promise<R>,
  maxAttempts: number = 3,
  operation: string = 'operation'
) => {
  return async (...args: T): Promise<R> => {
    let lastError: ServiceError;
    
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        return await fn(...args);
      } catch (error) {
        lastError = ErrorHandler.handleError(error, `${operation} (attempt ${attempt})`);
        
        // Don't retry if error is not retryable or it's the last attempt
        if (!ErrorHandler.isRetryable(lastError) || attempt === maxAttempts) {
          throw lastError;
        }
        
        // Wait before retrying
        const delay = ErrorHandler.getRetryDelay(lastError, attempt);
        console.log(`⏰ Retrying ${operation} in ${delay}ms (attempt ${attempt + 1}/${maxAttempts})`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    
    throw lastError!;
  };
};

