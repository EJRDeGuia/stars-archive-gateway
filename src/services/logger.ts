/**
 * Structured logging service for production applications
 */

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  userId?: string;
  sessionId?: string;
}

class Logger {
  private isDevelopment = import.meta.env.MODE === 'development';
  private userId?: string;
  private sessionId?: string;

  setContext(userId?: string, sessionId?: string) {
    this.userId = userId;
    this.sessionId = sessionId;
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      userId: this.userId,
      sessionId: this.sessionId
    };

    // In development, use console for immediate feedback
    if (this.isDevelopment) {
      const logMethod = level === LogLevel.ERROR ? console.error : 
                       level === LogLevel.WARN ? console.warn : 
                       console.log;
      logMethod(`[${level.toUpperCase()}] ${message}`, context || '');
    }

    // In production, send to monitoring service (placeholder)
    if (!this.isDevelopment) {
      this.sendToMonitoring(entry);
    }
  }

  private async sendToMonitoring(entry: LogEntry) {
    try {
      // In a real implementation, send to your monitoring service
      // e.g., Sentry, LogRocket, DataDog, etc.
      if (entry.level === LogLevel.ERROR) {
        // Send errors to error tracking service
      }
    } catch (error) {
      // Fallback to console if monitoring fails
      console.error('Failed to send log to monitoring:', error);
    }
  }

  error(message: string, context?: Record<string, any>) {
    this.log(LogLevel.ERROR, message, context);
  }

  warn(message: string, context?: Record<string, any>) {
    this.log(LogLevel.WARN, message, context);
  }

  info(message: string, context?: Record<string, any>) {
    this.log(LogLevel.INFO, message, context);
  }

  debug(message: string, context?: Record<string, any>) {
    this.log(LogLevel.DEBUG, message, context);
  }

  // Specific logging methods for common use cases
  userAction(action: string, context?: Record<string, any>) {
    this.info(`User action: ${action}`, context);
  }

  apiCall(endpoint: string, method: string, duration?: number, context?: Record<string, any>) {
    this.info(`API call: ${method} ${endpoint}`, { 
      duration: duration ? `${duration}ms` : undefined, 
      ...context 
    });
  }

  searchQuery(query: string, resultCount: number, duration?: number) {
    this.info('Search performed', { 
      query: query.substring(0, 100), 
      resultCount, 
      duration: duration ? `${duration}ms` : undefined 
    });
  }
}

export const logger = new Logger();