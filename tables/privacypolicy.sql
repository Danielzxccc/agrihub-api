CREATE TABLE privacy_policy(
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP
);