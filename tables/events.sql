CREATE TABLE events(
    id SERIAL PRIMARY KEY,
    banner TEXT NOT NULL,
    event_start TIMESTAMP NOT NULL,
    event_end TIMESTAMP NOT NULL,
    where TEXT,
    title TEXT NOT NULL,
    about TEXT NOT NULL,
    is_archived BOOLEAN default FALSE,
    type TEXT NOT NULL,
    guide TEXT NOT NULL,
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