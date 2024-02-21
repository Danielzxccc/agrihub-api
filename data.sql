-- add bio 
-- add users

CREATE TYPE IF NOT EXISTS roles AS ENUM ('member', 'farmer', 'subfarm_head', 'farm_head', 'asst_admin', 'admin');

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
    role roles DEFAULT 'member',
    isbanned BOOLEAN DEFAULT TRUE,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
    farm_id INT REFERENCES community_farms(id) ON DELETE CASCADE,
    UNIQUE (username, email),
);

CREATE INDEX email_index
ON users (email);
CREATE INDEX username_index
ON users (username);

CREATE TYPE IF NOT EXISTS farm_application_status AS ENUM ('pending', 'approved');

CREATE TABLE farm_application(
    id SERIAL PRIMARY KEY,
    farm_name TEXT NOT NULL,
    farm_size INT NOT NULL,
    district TEXT NOT NULL,
    id_type TEXT NOT NULL,
    valid_id TEXT NOT NULL,
    selfie TEXT NOT NULL,
    status farm_application_status DEFAULT 'pending',
);

CREATE INDEX farm_application_status_index ON farm_application (status);

CREATE TABLE farms(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    farm_head INT NOT NULL,
    district TEXT NOT NULL,
    size INT,
    cover_photo TEXT,
    avatar TEXT,
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
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(userid, farmid),
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
    p_season INT[],
    is_other BOOLEAN default FALSE,
    harvest_season INT, -- 0 - 11,
    isyield BOOLEAN default FALSE, 
    growth_span INT,
    UNIQUE(name),
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP
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
    image TEXT[],
    isHarvested BOOLEAN DEFAULT FALSE,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (crop_id) REFERENCES crops, 
    FOREIGN KEY (farmid) REFERENCES sub_farms(id) ON DELETE CASCADE,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
);

-- CREATE TYPE IF NOT EXISTS pest_report_status AS ENUM ('active', 'solved');

-- CREATE TABLE pest_report(
--     id SERIAL PRIMARY KEY,
--     crop_report_id INT NOT NULL,
--     userid INT NOT NULL,
--     pest_type TEXT,
--     date_noticed DATE NOT NULL,
--     date_solved DATE NOT NULL,
--     severity INT NOT NULL,
--     image text NOT NULL,
--     summary TEXT NOT NULL,
--     status pest_report_status NOT NULL,
--     createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
--     updatedAt timestamp DEFAULT CURRENT_TIMESTAMP
--     FOREIGN KEY (crop_report_id) REFERENCES crop_reports(id) ON DELETE CASCADE,
--     FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
-- );


-- CREATE TABLE crop_problems (
--     id SERIAL PRIMARY KEY,
--     crop_report_id INT NOT NULL,
--     description TEXT NOT NULL,
--     tags INT[] NOT NULL,
--     image TEXT NOT NULL,
--     createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
--     updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (crop_report_id) REFERENCES crop_reports(id) ON DELETE CASCADE
-- );

-- CREATE TABLE farm_problems (
--     id SERIAL PRIMARY KEY,
--     farmid INT NOT NULL,
--     description TEXT NOT NULL,
--     tags INT[] NOT NULL,
--     FOREIGN KEY (crop_report_id) REFERENCES crop_reports(id) ON DELETE CASCADE
-- );

-- CREATE TABLE farm_report_logs(
--     id SERIAL PRIMARY KEY,
-- );

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
    userid INT REFERENCES users(id) ON DELETE CASCADE,
    tagid INT REFERENCES tags(id) ON DELETE CASCADE,
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


-- CREATE TABLE reported_questions(
--     id SERIAL PRIMARY KEY,
--     reportedBy INT NOT NULL,
--     quesitonid INT NOT NULL,
--     report_type VARCHAR NOT NULL,
--     report_details TEXT,
--     createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
--     updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
--     FOREIGN KEY (reportedBy) REFERENCES users(id) ON DELETE CASCADE,
--     FOREIGN KEY (quesitonid) REFERENCES forums(id) ON DELETE CASCADE
-- );


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

CREATE TABLE IF NOT EXISTS public.session (
  sid varchar NOT NULL COLLATE "default",
  sess json NOT NULL,
  expire timestamp(6) NOT NULL,
  CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON public.session ("expire");


SELECT lm.id, lm.title, lm.content, lm.type, lm.language, lm.status, lm.published_date
FROM learning_materials lm
JOIN learning_tags lt ON lm.id = lt.learning_id
JOIN tags t ON lt.tag_id = t.id
WHERE t.tag_name = 'foodsecurity';
