CREATE TYPE IF NOT EXISTS cms_status AS ENUM ('draft', 'published');

CREATE TABLE events(
    id SERIAL PRIMARY KEY,
    banner TEXT,
    event_start DATETIME,
    event_end DATETIME,
    location TEXT,
    title TEXT NOT NULL,
    about TEXT,
    is_archived BOOLEAN default FALSE,
    status cms_status default draft,
    type TEXT, --virtual or onsite
    guide,
    published_date TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

CREATE TABLE event_partnership(
    id SERIAL PRIMARY KEY,
    event_id INT NOT NULL,
    name TEXT NOT NULL,
    logo NOT NULL,
    organizer BOOLEAN DEFAULT false,
    type TEXT, --partnershipm, sponsored, supported
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE event_speaker(
    id SERIAL PRIMARY KEY,
    event_id INT NOT NULL,
    profile TEXT,
    name TEXT,
    title TEXT,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);