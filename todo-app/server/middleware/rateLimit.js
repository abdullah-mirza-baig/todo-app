// import rateLimit from 'express-rate-limit';

// const apiLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 2, // max 100 requests per IP
//   message: "Too many requests, please try again later.",

// });

// export default apiLimiter;

import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many login attempts. Please try again after 15 minutes.",
  handler: (req, res, next, options) => {
    console.log(`⚠️ Rate limit hit from IP: ${req.ip}`);
    res.status(options.statusCode).json({ message: options.message });
  }
});

export default apiLimiter;