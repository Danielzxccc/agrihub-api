CREATE TABLE otp(
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    otp_code INT NOT NULL,
    expiresat TIMESTAMP NOT NULL,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
);