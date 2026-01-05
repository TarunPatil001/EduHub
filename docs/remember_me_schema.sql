-- Table to store "Remember Me" persistent login tokens
-- This implements the "Persistent Login Cookie" strategy (Selector + Validator)
-- Reference: https://paragonie.com/blog/2015/04/secure-authentication-php-with-long-term-persistence

CREATE TABLE remember_me_tokens (
    series_id VARCHAR(64) PRIMARY KEY, -- The 'selector' (publicly visible in cookie)
    user_id VARCHAR(36) NOT NULL,      -- The user who owns this token
    token_hash VARCHAR(64) NOT NULL,   -- The SHA-256 hash of the 'validator' (secret in cookie)
    last_used TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expiry_time TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Index for cleanup of expired tokens
CREATE INDEX idx_remember_me_expiry ON remember_me_tokens(expiry_time);
