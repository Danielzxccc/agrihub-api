CREATE TABLE change_email_request(
    id SERIAL PRIMARY KEY,
    userid INT NOT NULL,
    email TEXT NOT NULL,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE change_number_request(
    id SERIAL PRIMARY KEY,
    otp INT NOT NULL,
    userid INT NOT NULL,
    number TEXT NOT NULL,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
)

CREATE INDEX otp_number_index
ON change_number_request (otp);