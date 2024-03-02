CREATE TABLE farm_problems(
    id SERIAL PRIMARY KEY,
    problem TEXT NOT NULL,
    description TEXT NOT NULL,
    common BOOLEAN DEFAULT true,
    is_archived BOOLEAN DEFAULT false,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE farm_problem_materials(
    id SERIAL PRIMARY KEY,
    farm_problem_id INT REFERENCES farm_problems(id) ON DELETE CASCADE,
    learning_id INT REFERENCES learning_materials(id) ON DELETE CASCADE,
    UNIQUE (farm_problem_id, learning_id)
);

CREATE TYPE IF NOT EXISTS problem_status AS ENUM ('resolved', 'pending');

CREATE TABLE reported_problems(
    id SERIAL PRIMARY KEY,
    community_farm INT NOT NULL,
    userid INT NOT NULL,
    problem_id INT NOT NULL,
    status problem_status DEFAULT 'pending',
    date_noticed TIMESTAMP,
    date_solved TIMESTAMP,
    is_helpful BOOLEAN,
    feedback TEXT,
    FOREIGN KEY (community_farm) REFERENCES community_farms(id) ON DELETE CASCADE,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (problem_id) REFERENCES farm_problems(id) ON DELETE CASCADE
);