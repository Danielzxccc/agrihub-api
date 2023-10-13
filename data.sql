CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    firstname TEXT NOT NULL,

);

CREATE UNIQUE INDEX unique_email_index
ON users (email);