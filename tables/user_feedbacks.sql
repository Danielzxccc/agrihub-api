CREATE TABLE user_feedbacks(
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    feedback TEXT NOT NULL,
    rating INT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
);