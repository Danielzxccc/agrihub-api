CREATE TABLE audit_logs(
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL
    action TEXT,
    section TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
);