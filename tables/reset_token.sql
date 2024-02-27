CREATE TABLE reset_token(
    id UUID NOT NULL PRIMARY DEFAULT gen_random_uuid(),
    userid INT NOT NULL,
    expiresat timestamp,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    userid INT REFERENCES users(id) ON DELETE CASCADE
);