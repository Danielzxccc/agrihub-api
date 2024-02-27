CREATE TYPE IF NOT EXISTS cms_status AS ENUM ('draft', 'published');

CREATE TABLE events(
    id SERIAL PRIMARY KEY,
    banner TEXT,
    event_start TIMESTAMP,
    event_end TIMESTAMP,
    location TEXT,
    title TEXT NOT NULL,
    about TEXT,
    is_archived BOOLEAN default FALSE,
    status cms_status default 'draft',
    type TEXT, --virtual or onsite
    guide TEXT,
    published_date TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_partnership(
    id SERIAL PRIMARY KEY,
    event_id INT NOT NULL,
    name TEXT NOT NULL,
    logo TEXT NOT NULL,
    organizer BOOLEAN DEFAULT false,
    type TEXT, --partnership, sponsored, supported
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE event_speaker(
    id SERIAL PRIMARY KEY,
    event_id INT NOT NULL,
    profile TEXT,
    name TEXT,
    title TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

CREATE TABLE event_tags(
    id SERIAL PRIMARY KEY,
    event_id INT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    tag_id INT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE(event_id, tag_id)
);