
CREATE TABLE farm_questions(
    id SERIAL PRIMARY KEY,
    farmid INT NOT NULL,
    question TEXT NOT NULL,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmid) REFERENCES community_farms(id) ON DELETE CASCADE
);

CREATE TABLE farm_member_application(
    id SERIAL PRIMARY KEY,
    farmid INT NOT NULL,
    userid INT NOT NULL,
    contact_person TEXT,
    proof_selfie TEXT NOT NULL,
    valid_id TEXT NOT NULL,
    reason TEXT NOT NULL,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmid) REFERENCES community_farms(id) ON DELETE CASCADE,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE application_answers(
    id SERIAL PRIMARY KEY,
    questionid INT NOT NULL,
    applicationid INT NOT NULL,
    answer TEXT NOT NULL,
    FOREIGN KEY (questionid) REFERENCES farm_questions(id) ON DELETE CASCADE,
    FOREIGN KEY (applicationid) REFERENCES farm_member_application(id) ON DELETE CASCADE
);