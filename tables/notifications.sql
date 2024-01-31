CREATE TABLE user_notifications(
    id SERIAL PRIMARY KEY,
    emitted_to INT NOT NULL,
    body TEXT NOT NULL,
    redirect_to TEXT,
    viewed BOOLEAN default FALSE,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (emitted_to) REFERENCES users(id) ON DELETE CASCADE
);

-- subscription nila sa notif
CREATE TABLE subscriptions(
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    payload JSONB NOT NULL, --hash nung payload naka JSON
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(userid)
);   