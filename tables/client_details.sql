CREATE TABLE client_details(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    logo TEXT NOT NULL,
    email TEXT NOT NULL,
    contact_number TEXT NOT NULL,
    address TEXT NOT NULL,
    mission TEXT NOT NULL,
    vision TEXT NOT NULL,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE client_socials(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    link TEXT NOT NULL,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE client_partners(
    id SERIAL PRIMARY KEY,
    logo TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE client_members(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    image TEXT,
    position TEXT NOT NULL,
    description TEXT,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP
);