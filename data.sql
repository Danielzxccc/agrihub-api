CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
    email TEXT NOT NULL,
    firstname TEXT NOT NULL
);

CREATE TABLE forums(
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    title TEXT NOT NULL,
    question TEXT NOT NULL,
    imagesrc TEXT,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(id)
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
    FOREIGN KEY (userid) REFERENCES users(id)
);

CREATE UNIQUE INDEX unique_email_index
ON users (email);
CREATE UNIQUE INDEX unique_username_index
ON users (username);