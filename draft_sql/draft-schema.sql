CREATE TABLE answer_votes(
    id SERIAL PRIMARY KEY,
    answerid INT NOT NULL,
    userid INT NOT NULL,
    type TEXT NOT NULL,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (answerid) REFERENCES forums_answers(id) ON DELETE CASCADE,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (answerid, userid)
);


CREATE TABLE community_events(
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    event_name TEXT,
    event_location TEXT,
    event_date timestamp,
    scope TEXT DEFAULT 'Private', --if private or public 
    details TEXT, --description
    imagesrc TEXT,
    longitude DOUBLE PRECISION,
    latitude DOUBLE PRECISION,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
    status BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
);

