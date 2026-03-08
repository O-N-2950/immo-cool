/**
 * immo.cool — Security Layer
 * 
 * Rate limiting, input validation, XSS sanitization, CORS
 * Audit fixes: #3 #4 #5 #6 #8 #9 #10
 */

// ============================================================
// RATE LIMITER (in-memory, per-IP)
// ============================================================

const rateLimitStore = new Map();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore) {
    if (now - entry.windowStart > 120_000) { // 2 min stale
      rateLimitStore.delete(key);
    }
  }
}, 300_000);

/**
 * Check rate limit for a given key
 * @param {string} key - IP or IP+route
 * @param {number} maxRequests - Max requests per window
 * @param {number} windowMs - Window in milliseconds
 * @returns {{ allowed: boolean, remaining: number, resetAt: number }}
 */
export function checkRateLimit(key, maxRequests = 60, windowMs = 60_000) {
  const now = Date.now();
  let entry = rateLimitStore.get(key);

  if (!entry || now - entry.windowStart > windowMs) {
    entry = { count: 0, windowStart: now };
    rateLimitStore.set(key, entry);
  }

  entry.count++;
  const remaining = Math.max(0, maxRequests - entry.count);
  const resetAt = entry.windowStart + windowMs;

  return {
    allowed: entry.count <= maxRequests,
    remaining,
    resetAt,
  };
}

/**
 * Get client IP from request
 */
export function getClientIP(request) {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

// Rate limit presets
export const RATE_LIMITS = {
  general: { max: 60, window: 60_000 },      // 60 req/min
  auth: { max: 5, window: 60_000 },           // 5 req/min (login/register)
  ai: { max: 10, window: 60_000 },            // 10 req/min (AI endpoints)
  tools: { max: 15, window: 60_000 },         // 15 req/min (PDF generation)
};

// ============================================================
// CORS
// ============================================================

const ALLOWED_ORIGINS = [
  'https://www.immocool.ch',
  'https://immocool.ch',
  'https://immo.cool',
  'https://www.immo.cool',
  'https://immo-cool-production.up.railway.app',
];

// Add localhost in development
if (process.env.NODE_ENV !== 'production') {
  ALLOWED_ORIGINS.push('http://localhost:3000', 'http://localhost:3001');
}

/**
 * Check if origin is allowed
 */
export function isOriginAllowed(origin) {
  if (!origin) return true; // Same-origin requests
  return ALLOWED_ORIGINS.includes(origin);
}

/**
 * Get CORS headers for a request
 */
export function getCorsHeaders(request) {
  const origin = request.headers.get('origin');
  const headers = {};

  if (origin && isOriginAllowed(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
    headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
    headers['Access-Control-Allow-Credentials'] = 'true';
    headers['Access-Control-Max-Age'] = '86400'; // 24h preflight cache
  }

  return headers;
}

// ============================================================
// SECURITY HEADERS
// ============================================================

export const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self)',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://api.stripe.com",
};

// ============================================================
// INPUT SANITIZATION (XSS prevention)
// ============================================================

/**
 * Strip HTML tags and dangerous characters
 */
export function sanitizeString(input) {
  if (typeof input !== 'string') return input;
  return input
    .replace(/[<>]/g, '') // Remove < >
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers (onclick=, etc.)
    .replace(/data:/gi, '') // Remove data: protocol  
    .replace(/vbscript:/gi, '') // Remove vbscript:
    .trim()
    .slice(0, 10000); // Max length safety
}

/**
 * Deep sanitize an object (recursive)
 */
export function sanitizeObject(obj) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return sanitizeString(obj);
  if (typeof obj === 'number' || typeof obj === 'boolean') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeObject);
  if (typeof obj === 'object') {
    const clean = {};
    for (const [key, value] of Object.entries(obj)) {
      clean[sanitizeString(key)] = sanitizeObject(value);
    }
    return clean;
  }
  return obj;
}

// ============================================================
// INPUT VALIDATORS (immobilier-specific)
// ============================================================

/**
 * Validate email format
 */
export function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  const re = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
  return re.test(email) && email.length <= 254;
}

/**
 * Validate Swiss phone number
 */
export function isValidSwissPhone(phone) {
  if (!phone) return true; // optional
  const cleaned = phone.replace(/[\s\-\.\(\)]/g, '');
  return /^(\+41|0041|0)\d{9,10}$/.test(cleaned);
}

/**
 * Validate price/rent (positive number, reasonable range)
 */
export function isValidPrice(value) {
  const num = Number(value);
  return !isNaN(num) && num > 0 && num <= 100_000; // Max CHF 100k/month
}

/**
 * Validate surface in m²
 */
export function isValidSurface(value) {
  const num = Number(value);
  return !isNaN(num) && num > 0 && num <= 10_000; // Max 10'000 m²
}

/**
 * Validate number of rooms (Swiss system: 1.0, 1.5, 2.0, 2.5, ...)
 */
export function isValidRooms(value) {
  const num = Number(value);
  return !isNaN(num) && num >= 1 && num <= 20 && (num * 2) % 1 === 0;
}

/**
 * Validate Swiss canton code
 */
export function isValidCanton(canton) {
  const CANTONS = ['AG','AI','AR','BL','BS','BE','FR','GE','GL','GR','JU','LU','NE','NW','OW','SG','SH','SZ','SO','TG','TI','UR','VD','VS','ZG','ZH'];
  return typeof canton === 'string' && CANTONS.includes(canton.toUpperCase());
}

/**
 * Validate Swiss NPA (postal code)
 */
export function isValidNPA(npa) {
  const num = Number(npa);
  return !isNaN(num) && num >= 1000 && num <= 9999;
}

/**
 * Sanitize an address string (XSS + format)
 */
export function sanitizeAddress(address) {
  if (!address) return '';
  return sanitizeString(address).slice(0, 200);
}

/**
 * Validate password strength
 */
export function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 8 && password.length <= 128;
}

/**
 * Validate and sanitize property data
 */
export function validatePropertyData(data) {
  const errors = [];

  if (data.monthlyRent !== undefined && !isValidPrice(data.monthlyRent)) {
    errors.push('Loyer mensuel invalide (doit être positif, max CHF 100\'000)');
  }
  if (data.surface !== undefined && !isValidSurface(data.surface)) {
    errors.push('Surface invalide (doit être positive, max 10\'000 m²)');
  }
  if (data.rooms !== undefined && !isValidRooms(data.rooms)) {
    errors.push('Nombre de pièces invalide (1-20, par demi-pièce)');
  }
  if (data.canton && !isValidCanton(data.canton)) {
    errors.push('Canton invalide');
  }
  if (data.npa && !isValidNPA(data.npa)) {
    errors.push('NPA invalide (1000-9999)');
  }
  if (data.street) {
    data.street = sanitizeAddress(data.street);
  }
  if (data.city) {
    data.city = sanitizeString(data.city).slice(0, 100);
  }
  if (data.description) {
    data.description = sanitizeString(data.description).slice(0, 5000);
  }
  if (data.title) {
    data.title = sanitizeString(data.title).slice(0, 200);
  }

  return { valid: errors.length === 0, errors, data };
}

/**
 * Validate registration data
 */
export function validateRegistrationData(data) {
  const errors = [];

  if (!isValidEmail(data.email)) {
    errors.push('Email invalide');
  }
  if (!isValidPassword(data.password)) {
    errors.push('Mot de passe trop court (min 8 caractères)');
  }
  if (!['LANDLORD', 'TENANT', 'ARTISAN'].includes(data.role)) {
    errors.push('Rôle invalide (LANDLORD, TENANT, ARTISAN)');
  }
  if (!data.firstName || sanitizeString(data.firstName).length < 1) {
    errors.push('Prénom requis');
  }
  if (!data.lastName || sanitizeString(data.lastName).length < 1) {
    errors.push('Nom requis');
  }
  if (data.phone && !isValidSwissPhone(data.phone)) {
    errors.push('Numéro de téléphone suisse invalide');
  }
  if (data.maxBudget && !isValidPrice(data.maxBudget)) {
    errors.push('Budget max invalide');
  }
  if (data.monthlyIncome && !isValidPrice(data.monthlyIncome)) {
    errors.push('Revenu mensuel invalide');
  }

  return { valid: errors.length === 0, errors };
}

// ============================================================
// ERROR HANDLING (no stack traces in prod)
// ============================================================

/**
 * Create a safe error response (no internal details in production)
 */
export function safeErrorResponse(error, status = 500) {
  const isDev = process.env.NODE_ENV !== 'production';

  console.error(`[immo.cool ERROR] ${error.message}`, isDev ? error.stack : '');

  return {
    error: isDev ? error.message : 'Une erreur interne est survenue',
    ...(isDev && { stack: error.stack }),
    status,
  };
}
