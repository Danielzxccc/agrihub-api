
CREATE TABLE farm_questions(
    id SERIAL PRIMARY KEY,
    farmid INT NOT NULL,
    question TEXT NOT NULL,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmid) REFERENCES community_farms(id) ON DELETE CASCADE
);

CREATE TYPE IF NOT EXISTS farm_member_application_status AS ENUM ('accepted', 'rejected');

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
    status farm_member_application_status default 'pending',
    remarks TEXT,
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

CREATE TYPE IF NOT EXISTS community_tasks_type AS ENUM ('plant', 'harvest');
CREATE TYPE IF NOT EXISTS community_tasks_status AS ENUM ('completed', 'pending');


CREATE TABLE community_tasks(
    id SERIAL PRIMARY KEY,
    farmid INT NOT NULL,
    assigned_to INT NOT NULL,
    report_id INT,
    crop_id INT,
    due_date DATE NOT NULL,
    task_type community_tasks_type NOT NULL,
    message TEXT,
    action_message TEXT,
    status community_tasks_status DEFAULT 'pending',
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmid) REFERENCES community_farms(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (report_id) REFERENCES community_crop_reports(id) ON DELETE CASCADE
);


CREATE TYPE IF NOT EXISTS community_events_type AS ENUM ('private', 'public');

CREATE TABLE community_events(
    id SERIAL PRIMARY KEY,
    farmid INT NOT NULL,
    title TEXT NOT NULL,
    about TEXT NOT NULL,
    banner TEXT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    type community_events_type NOT NULL,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmid) REFERENCES community_farms(id) ON DELETE CASCADE
);

CREATE TABLE community_events_tags(
    id SERIAL PRIMARY KEY,
    eventid INT REFERENCES community_events(id) ON DELETE CASCADE,
    tagid INT REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE (eventid, tagid)
);


