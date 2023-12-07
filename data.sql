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


CREATE TABLE farms(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    farm_head INT NOT NULL,
    district TEXT NOT NULL,
    size INT,
    cover_photo TEXT,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (farm_head, name),
    FOREIGN KEY (farm_head) REFERENCES users(id) ON DELETE CASCADE
);

-- sub farms
CREATE TABLE sub_farms(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    farmid INT NOT NULL,
    farm_head INT NOT NULL,
    UNIQUE (farm_head, name),
    FOREIGN KEY (farmid) REFERENCES farms(id) ON DELETE CASCADE,
    FOREIGN KEY (farm_head) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE farm_members(
    id SERIAL PRIMARY KEY,
    userid INT,
    farmid INT NOT NULL,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (farmid) REFERENCES sub_farms(id) ON DELETE CASCADE
);

CREATE TABLE crops(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    image TEXT,
    seedling_season INT, -- 0 - 11,
    planting_season INT, -- 0 - 11,
    harvest_season INT, -- 0 - 11,
    growth_span INT,
);

CREATE TABLE crop_reports(
    id SERIAL PRIMARY KEY,
    farmid INT NOT NULL,
    userid INT NOT NULL,
    crop_name TEXT,
    crop_id INT,
    planted_qty INT NOT NULL,
    harvested_qty INT,
    yield INT,
    withered_crops INT,
    date_planted DATE NOT NULL,
    expected_harvest DATE,
    date_harvested DATE,
    isHarvested BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (crops) REFERENCES crops 
    FOREIGN KEY (farmid) REFERENCES farms(id) ON DELETE CASCADE,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TYPE IF NOT EXISTS pest_report_status AS ENUM ('active', 'solved');

CREATE TABLE pest_report(
    id SERIAL PRIMARY KEY,
    crop_report_id INT NOT NULL,
    userid INT NOT NULL,
    pest_type TEXT,
    date_noticed DATE NOT NULL,
    date_solved DATE NOT NULL,
    severity INT NOT NULL,
    image text NOT NULL,
    summary TEXT NOT NULL,
    status pest_report_status NOT NULL,
    FOREIGN KEY (crop_report_id) REFERENCES crop_reports(id) ON DELETE CASCADE,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE crop_problems (
    id SERIAL PRIMARY KEY,
    crop_report_id INT NOT NULL,
    description TEXT NOT NULL,
    tags INT[] NOT NULL,
    image TEXT NOT NULL,
    FOREIGN KEY (crop_report_id) REFERENCES crop_reports(id) ON DELETE CASCADE
);

CREATE TABLE farm_problems (
    id SERIAL PRIMARY KEY,
    farmid INT NOT NULL,
    description TEXT NOT NULL,
    tags INT[] NOT NULL,
    FOREIGN KEY (crop_report_id) REFERENCES crop_reports(id) ON DELETE CASCADE
);

CREATE TABLE farm_report_logs(
    id SERIAL PRIMARY KEY,
);

-- add details
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    details TEXT,
    tag_name TEXT,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP
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

CREATE TABLE IF NOT EXISTS public.session (
  sid varchar NOT NULL COLLATE "default",
  sess json NOT NULL,
  expire timestamp(6) NOT NULL,
  CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON public.session ("expire");
