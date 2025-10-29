import { NextRequest } from 'next/server';

// Generate a secure API key for internal API calls
// In production, use a proper secret management system
const INTERNAL_API_KEY = process.env.INTERNAL_API_KEY || 'x402_internal_' + Date.now();

// Validate API request
export function validateApiRequest(request: NextRequest): boolean {
  // Check if request is from same origin (server-side)
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  
  // Allow same-origin requests
  if (origin && host && origin.includes(host)) {
    return true;
  }
  
  // Check for internal API key in header
  const apiKey = request.headers.get('x-api-key');
  if (apiKey === INTERNAL_API_KEY) {
    return true;
  }
  
  return false;
}

// Rate limiting (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

export function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  
  if (!record || now > record.resetTime) {
    // New or expired record
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return { allowed: true, remaining: RATE_LIMIT - 1 };
  }
  
  if (record.count >= RATE_LIMIT) {
    return { allowed: false, remaining: 0 };
  }
  
  record.count++;
  return { allowed: true, remaining: RATE_LIMIT - record.count };
}

// Get client identifier (IP or wallet address)
export function getClientIdentifier(request: NextRequest, walletAddress?: string): string {
  if (walletAddress) return walletAddress;
  
  // Try to get IP from various headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfIp = request.headers.get('cf-connecting-ip');
  
  return forwarded?.split(',')[0] || realIp || cfIp || 'unknown';
}

// Validate wallet address format
export function isValidSolanaAddress(address: string): boolean {
  // Basic validation: Solana addresses are base58 encoded and 32-44 characters
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;
  return base58Regex.test(address);
}

// Export API key for client-side usage (if needed)
export const API_CONFIG = {
  INTERNAL_KEY: INTERNAL_API_KEY,
  RATE_LIMIT,
  RATE_LIMIT_WINDOW
};
