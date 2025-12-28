# Logging Module

A centralized logging module built on top of Winston that provides structured logging, log rotation, and multiple output formats. This module is integrated throughout the application to provide consistent logging capabilities.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Configuration](#configuration)
- [Log Levels](#log-levels)
- [Log Formats](#log-formats)
- [Usage Examples](#usage-examples)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

The Logging Module provides a centralized logging solution using Winston, a popular Node.js logging library. It supports multiple transports (console and file), log rotation, structured logging, and customizable log formats.

### Features

- ✅ Console logging with colorized output
- ✅ File logging with daily rotation
- ✅ Structured JSON logging
- ✅ Log level filtering
- ✅ Automatic log rotation (daily)
- ✅ Log compression (gzip)
- ✅ Configurable log retention (14 days)
- ✅ Error stack trace logging
- ✅ Context-aware logging
- ✅ Timestamp formatting

## Architecture

The module is a simple NestJS module that configures and exports Winston:

```
logging/
├── logging.module.ts      # NestJS module
└── winston.config.ts      # Winston configuration
```

### Module Structure

The `LoggingModule` imports and configures `WinstonModule` with a custom configuration:

```typescript
@Module({
  imports: [WinstonModule.forRoot(winstonConfig)],
  exports: [WinstonModule],
})
export class LoggingModule {}
```

This makes Winston available throughout the application via dependency injection.

## Features

### Console Transport

Logs are output to the console with:

- **Colorized output**: Different colors for different log levels
- **Formatted timestamps**: Human-readable timestamps
- **Context information**: Module/class context in logs
- **Stack traces**: Full stack traces for errors
- **Trace information**: Additional trace context

### File Transport

Logs are written to files with:

- **Daily rotation**: New log file each day
- **Automatic compression**: Old logs are gzipped
- **Retention policy**: Logs kept for 14 days
- **Structured format**: JSON format for easy parsing
- **Location**: Logs stored in `logs/` directory

### Log Rotation

Logs are automatically rotated:

- **Daily rotation**: New file created each day
- **File naming**: `YYYY-MM-DD.log` format
- **Compression**: Old files are automatically gzipped
- **Max size**: 20MB per file
- **Retention**: 14 days of logs kept

## Configuration

The logging module is configured via `winston.config.ts`:

```typescript
export const winstonConfig: winston.LoggerOptions = {
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'api' },
  transports: [
    new winston.transports.Console({
      format: consoleFormat,
    }),
    fileRotateTransport,
  ],
};
```

### Environment Variables

Configure logging behavior via environment variables:

```env
# Log level (error, warn, info, verbose, debug)
LOG_LEVEL=info
```

**Available Log Levels:**

- `error`: Only error logs
- `warn`: Warning and error logs
- `info`: Info, warning, and error logs (default)
- `verbose`: Verbose, info, warning, and error logs
- `debug`: All logs including debug

## Log Levels

Winston supports the following log levels (from highest to lowest priority):

1. **error**: Error logs - system errors, exceptions
2. **warn**: Warning logs - potential issues
3. **info**: Informational logs - general information
4. **verbose**: Verbose logs - detailed information
5. **debug**: Debug logs - debugging information
6. **silly**: Silly logs - very detailed debugging

### When to Use Each Level

- **error**: Use for exceptions, errors, and critical failures
- **warn**: Use for potential issues that don't break functionality
- **info**: Use for general application flow and important events
- **verbose**: Use for detailed information about operations
- **debug**: Use for debugging specific issues

## Log Formats

### Console Format

Console logs use a human-readable format with colors:

```
2024-01-15 10:30:45 info [UserService] User created successfully
2024-01-15 10:30:46 error [AuthService] Authentication failed
  at AuthService.validate (/app/src/auth/auth.service.ts:45:11)
```

**Features:**

- Timestamp in `YYYY-MM-DD HH:mm:ss` format
- Colorized log levels
- Context in cyan color `[ContextName]`
- Stack traces in red
- Trace information in gray

### File Format

File logs use structured JSON format:

```json
{
  "timestamp": "2024-01-15T10:30:45.123Z",
  "level": "info",
  "message": "User created successfully",
  "context": "UserService",
  "service": "api"
}
```

**Features:**

- Structured JSON for easy parsing
- Timestamp in ISO format
- All metadata included
- Stack traces included for errors

## Usage Examples

### Basic Logging

Inject the `Logger` service in your classes:

```typescript
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  createUser(userData: UserData) {
    this.logger.log('Creating user');
    // ... create user logic
    this.logger.log('User created successfully');
  }
}
```

### Log Levels

```typescript
// Error logging
this.logger.error('Failed to create user', error.stack);

// Warning logging
this.logger.warn('User email already exists');

// Info logging
this.logger.log('User created successfully');

// Verbose logging
this.logger.verbose('Processing user data');

// Debug logging
this.logger.debug('User data:', userData);
```

### Context-Aware Logging

The logger automatically includes the class name as context:

```typescript
export class UserService {
  private readonly logger = new Logger(UserService.name);
  // Logs will include [UserService] context
}
```

### Structured Logging

Add additional metadata to logs:

```typescript
this.logger.log('User created', { userId: user.id, email: user.email });
```

### Error Logging with Stack Traces

```typescript
try {
  // ... operation
} catch (error) {
  this.logger.error('Operation failed', error.stack);
  throw error;
}
```

## Best Practices

1. **Use Appropriate Log Levels**
   - Use `error` for exceptions and critical failures
   - Use `warn` for potential issues
   - Use `info` for important events
   - Use `debug` for debugging (disable in production)

2. **Include Context**
   - Always use class name as logger context
   - Include relevant data in log messages
   - Use structured logging for complex data

3. **Don't Log Sensitive Information**
   - Never log passwords, tokens, or secrets
   - Be careful with user data (PII)
   - Use log sanitization if needed

4. **Performance Considerations**
   - Use appropriate log levels in production
   - Avoid logging in tight loops
   - Use conditional logging for expensive operations

5. **Error Handling**
   - Always log errors with stack traces
   - Include context about what operation failed
   - Log both the error and the operation context

6. **Log Rotation**
   - Monitor log file sizes
   - Adjust retention policy as needed
   - Consider log aggregation for production

## Troubleshooting

### Common Issues

1. **Logs Not Appearing**
   - **Solution**: Check `LOG_LEVEL` environment variable
   - Verify logger is properly injected
   - Check log file permissions

2. **Log Files Not Created**
   - **Solution**: Check `logs/` directory exists
   - Verify write permissions
   - Check disk space

3. **Too Many Log Files**
   - **Solution**: Adjust retention policy in `winston.config.ts`
   - Reduce `maxFiles` value
   - Clean up old log files manually

4. **Logs Too Verbose**
   - **Solution**: Increase `LOG_LEVEL` to `warn` or `error`
   - Remove unnecessary debug/verbose logs
   - Use conditional logging

5. **Performance Issues**
   - **Solution**: Reduce log level in production
   - Disable file logging in development if needed
   - Use log sampling for high-volume logs

### Debugging

Enable debug logging to troubleshoot logging issues:

```env
LOG_LEVEL=debug
```

This will show:

- All log operations
- Winston internal operations
- Transport configuration

## Log File Management

### Log File Location

Logs are stored in the `logs/` directory relative to the application root:

```
project-starter/
└── apps/
    └── api/
        └── logs/
            ├── 2024-01-15.log
            ├── 2024-01-16.log
            ├── 2024-01-17.log.gz
            └── ...
```

### Log Rotation

Logs are automatically rotated:

- **Daily**: New file created at midnight
- **Compression**: Files older than current day are gzipped
- **Retention**: Files older than 14 days are deleted
- **Max Size**: 20MB per file (triggers rotation if exceeded)

### Manual Log Cleanup

To manually clean up old logs:

```bash
# Remove logs older than 7 days
find logs/ -name "*.log*" -mtime +7 -delete

# Remove all compressed logs
find logs/ -name "*.gz" -delete
```

## Integration with Other Modules

### Application Modules

All application modules use the logging module:

```typescript
import { Logger } from '@nestjs/common';

export class SomeService {
  private readonly logger = new Logger(SomeService.name);
  // ... use logger
}
```

### Shared Module

The logging module is imported by the shared module and available throughout the application.

## Configuration Options

### Custom Log Format

Modify `winston.config.ts` to customize log formats:

```typescript
const customFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.json(),
  // Add custom formatters
);
```

### Additional Transports

Add additional transports (e.g., remote logging):

```typescript
transports: [
  new winston.transports.Console(),
  new winston.transports.File({ filename: 'error.log', level: 'error' }),
  new winston.transports.Http({ host: 'log-server', port: 5000 }),
],
```

### Log Filtering

Filter logs by context or message:

```typescript
const filterFormat = winston.format((info) => {
  if (info.context === 'SomeService') {
    return false; // Don't log this
  }
  return info;
})();
```

## Related Documentation

- [Winston Documentation](https://github.com/winstonjs/winston)
- [NestJS Logging](https://docs.nestjs.com/techniques/logger)
- [Main README](../../../../README.md)
