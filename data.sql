CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username TEXT,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    firstname TEXT,
    lastname TEXT,
    birthdate DATE,
    present_address TEXT,
    avatar TEXT,
    zipcode TEXT,
    district TEXT,
    municipality TEXT,
    verification_level INT,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (username, email)
);

CREATE INDEX email_index
ON users (email);
CREATE INDEX username_index
ON users (username);

CREATE TABLE forums(
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    title TEXT NOT NULL,
    question TEXT NOT NULL,
    imagesrc TEXT,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE articles(
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    thumbnailsrc TEXT,
    imagesrc TEXT,
    articleStatus TEXT DEFAULT 'pending',
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE email_token(
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    token TEXT NOT NULL,
    expiresAt timestamp NOT NULL,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
)

CREATE INDEX email_token_index
ON email_token (token);

