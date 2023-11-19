
-- add bio 
-- add users
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
    bio TEXT,
    role TEXT DEFAULT 'user',
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (username, email)
);

CREATE INDEX email_index
ON users (email);
CREATE INDEX username_index
ON users (username);

-- add details
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    details TEXT,
    tag_name TEXT
);

CREATE TABLE user_tags (
    id SERIAL PRIMARY KEY,
    userid INT REFERENCES users(id),
    tagid INT REFERENCES tags(id),
    UNIQUE (userid, tagid)
);

-- forums/question
CREATE TABLE forums(
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    title TEXT NOT NULL,
    question TEXT NOT NULL,
    views INT DEFAULT 0,
    imagesrc TEXT[],
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE forums_answers(
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    forumid INT NOT NULL,
    answer TEXT NOT NULL,
    isAccepted BOOLEAN NOT NULL,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (forumid) REFERENCES forums(id) ON DELETE CASCADE
);

CREATE TABLE forums_comments(
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    answerid INT NOT NULL,
    comment TEXT NOT NULL,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (answerid) REFERENCES forums_answers(id) ON DELETE CASCADE
);

CREATE TABLE forums_tags(
    id SERIAL PRIMARY KEY,
    forumid INT REFERENCES forums(id) ON DELETE CASCADE,
    tagid INT REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE (forumid, tagid)
);

CREATE TABLE forums_ratings(
    id SERIAL PRIMARY KEY,
    questionid INT NOT NULL,
    userid INT NOT NULL,
    type TEXT NOT NULL,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (questionid) REFERENCES forums(id) ON DELETE CASCADE,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (questionid, userid)
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
    token UUID NOT NULL,
    expiresAt timestamp NOT NULL,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX email_token_index
ON email_token (token);


CREATE TABLE reported_questions(
    id SERIAL PRIMARY KEY,
    reportedBy INT NOT NULL,
    quesitonid INT NOT NULL,
    report_type VARCHAR NOT NULL,
    report_details TEXT,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reportedBy) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quesitonid) REFERENCES forums(id) ON DELETE CASCADE
);

