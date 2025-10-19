// ESP32 CamViewer - Authentication Utilities
// Generated: 2025-10-19
// Uses bcryptjs for password hashing

import bcrypt from 'bcryptjs';

/**
 * Hash a plain text password using bcrypt
 * @param password - Plain text password
 * @returns Hashed password
 */
export function hashPassword(password: string): string {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
}

/**
 * Compare a plain text password with a hash
 * @param password - Plain text password to verify
 * @param hash - Hashed password to compare against
 * @returns True if password matches, false otherwise
 */
export function comparePassword(password: string, hash: string): boolean {
  try {
    return bcrypt.compareSync(password, hash);
  } catch (error) {
    console.error('Error comparing passwords:', error);
    return false;
  }
}

/**
 * Validate password strength
 * @param password - Plain text password
 * @returns Validation result with success and message
 */
export function validatePassword(password: string): {
  isValid: boolean;
  message: string;
} {
  if (password.length < 4) {
    return {
      isValid: false,
      message: 'Password must be at least 4 characters long',
    };
  }

  if (password.length > 100) {
    return {
      isValid: false,
      message: 'Password is too long (max 100 characters)',
    };
  }

  return {
    isValid: true,
    message: 'Password is valid',
  };
}

/**
 * Validate username
 * @param username - Username to validate
 * @returns Validation result with success and message
 */
export function validateUsername(username: string): {
  isValid: boolean;
  message: string;
} {
  if (username.length < 3) {
    return {
      isValid: false,
      message: 'Username must be at least 3 characters long',
    };
  }

  if (username.length > 50) {
    return {
      isValid: false,
      message: 'Username is too long (max 50 characters)',
    };
  }

  // Allow alphanumeric, underscore, and hyphen
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(username)) {
    return {
      isValid: false,
      message: 'Username can only contain letters, numbers, underscore, and hyphen',
    };
  }

  return {
    isValid: true,
    message: 'Username is valid',
  };
}

/**
 * Generate a session token (simple UUID-based for MVP)
 * @returns Session token
 */
export function generateSessionToken(): string {
  return crypto.randomUUID();
}

/**
 * Check if session is expired
 * @param createdAt - Session creation timestamp
 * @param expiryMinutes - Session expiry time in minutes (default: 30)
 * @returns True if session is expired
 */
export function isSessionExpired(
  createdAt: Date,
  expiryMinutes: number = 30
): boolean {
  const now = new Date();
  const expiryTime = new Date(createdAt.getTime() + expiryMinutes * 60 * 1000);
  return now > expiryTime;
}
