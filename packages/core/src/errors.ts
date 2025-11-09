/**
 * Centralized error handling for Silk CSS-in-TypeScript
 */

export class SilkError extends Error {
  constructor(
    message: string,
    public code: string,
    public suggestion?: string
  ) {
    let fullMessage = `🎨 Silk Error [${code}]: ${message}`

    if (suggestion) {
      fullMessage += `\n💡 Suggestion: ${suggestion}`
    }

    super(fullMessage)
    this.name = 'SilkError'
  }
}

export class CSSValidationError extends SilkError {
  constructor(property: string, value: any, reason?: string) {
    const message = `Invalid CSS value for property '${property}': ${value}`
    const suggestion = `Check if '${value}' is a valid CSS value for '${property}'.`

    super(message, 'CSS_VALIDATION_ERROR', suggestion)
    this.name = 'CSSValidationError'
  }
}

export class ClassNameGenerationError extends SilkError {
  constructor(styleId: string, cause?: Error) {
    const message = `Failed to generate class name for style: ${styleId}`
    const suggestion = 'Ensure the style object is properly formatted and contains valid CSS properties.'

    super(message, 'CLASS_NAME_GENERATION_ERROR', suggestion)
    this.name = 'ClassNameGenerationError'
    this.cause = cause
  }
}

export class ConfigValidationError extends SilkError {
  constructor(configPath: string, issue: string) {
    const message = `Invalid configuration at ${configPath}: ${issue}`
    const suggestion = 'Check the Silk configuration documentation for correct syntax and options.'

    super(message, 'CONFIG_VALIDATION_ERROR', suggestion)
    this.name = 'ConfigValidationError'
  }
}

export class ZeroCodegenViolationError extends SilkError {
  constructor(functionName: string) {
    const message = `Runtime function '${functionName}' called in production mode`
    const suggestion = 'Make sure build-time compilation is properly configured with @sylphx/babel-plugin-silk.'

    super(message, 'ZERO_CODEGEN_VIOLATION', suggestion)
    this.name = 'ZeroCodegenViolationError'
  }
}

/**
 * Error boundary utility for safe CSS operations
 */
export function safeCSSOperation<T>(operation: () => T, fallback: T, context?: string): T {
  try {
    return operation()
  } catch (error) {
    if (error instanceof SilkError) {
      console.error(error.message)
    } else {
      console.error(`Unexpected error in ${context || 'CSS operation'}:`, error)
    }
    return fallback
  }
}

/**
 * Format error messages for better debugging
 */
export function formatError(error: unknown, context?: string): string {
  if (error instanceof SilkError) {
    return error.message
  }

  if (error instanceof Error) {
    return `🚨 Unexpected Error${context ? ` in ${context}` : ''}: ${error.message}`
  }

  return `🚨 Unknown Error${context ? ` in ${context}` : ''}: ${String(error)}`
}