CREATE TABLE user_notifications(
    id SERIAL PRIMARY KEY,
    emit_to INT NOT NULL,
    body TEXT NOT NULL,
    redirect_to TEXT,
    viewed BOOLEAN default FALSE,
    is_new BOOLEAN default TRUE,
    FOREIGN KEY (emit_to) REFERENCES users(id) ON DELETE CASCADE,
);

CREATE TABLE subscriptions(
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    payload JSONB NOT NULL,
    FOREIGN KEY (emit_to) REFERENCES users(id) ON DELETE CASCADE,
);   