import rateLimit from "express-rate-limit";

/**
 * Global API rate limiter: 250 requests per 15 minutes per IP
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 250,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests from this IP address. Please try again after 15 minutes.",
  },
});

/**
 * Strict authentication limiter: 5 login attempts per 15 minutes per IP
 * Protects against credential stuffing & brute-force attacks.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts. Please wait 15 minutes before trying again.",
  },
});

/**
 * Public RFQ Lead form limiter: 10 quote submissions per hour per IP
 * Protects against bot spam and automated proposal generation floods.
 */
export const rfqLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Exceeded RFQ inquiry rate limit. Please contact support directly or try again later.",
  },
});

/**
 * Public Job Application limiter: 10 applications per hour per IP
 */
export const jobApplyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many job applications submitted from this IP. Please try again later.",
  },
});

