CREATE TABLE change_email_request(
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    email TEXT NOT NULL,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
);