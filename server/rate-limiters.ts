import rateLimit from "express-rate-limit";

// Chat message rate limiter: 30 messages per minute per user
export const chatRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  message: 'Too many messages sent. Please wait before sending more.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use authenticated user ID as key
    return (req as any).user?.id || req.ip;
  },
});

// Call initiation rate limiter: 10 calls per hour per user
export const callRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: 'Too many call attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    return (req as any).user?.id || req.ip;
  },
});
