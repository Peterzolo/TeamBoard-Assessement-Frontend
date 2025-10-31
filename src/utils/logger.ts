/* eslint-disable no-console */

class Logger {
  info(...args: any[]) {
    console.info(" ℹ ", ...args);
  }

  success(...args: any[]) {
    console.log(" ✓ ", ...args);
  }

  error(...args: any[]) {
    console.error(" ✗ ", ...args);
  }

  warn(...args: string[]) {
    console.warn(" ⚠ ", ...args);
  }
}

export const logger = new Logger();
