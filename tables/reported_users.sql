CREATE TABLE reported_users(
    id SERIAL PRIMARY KEY,
    reported INT NOT NULL,
    reported_by INT NOT NULL,
    reason TEXT NOT NULL,
    evidence TEXT[] NOT NULL,
    notes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT default "pending",
    FOREIGN KEY (reported) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reported_by) REFERENCES users(id) ON DELETE CASCADE
);