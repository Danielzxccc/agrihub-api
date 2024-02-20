CREATE TABLE landing(
    id SERIAL PRIMARY KEY,
    cta_header TEXT,
    cta_description TEXT,
    approach TEXT,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE landing_images(
    id SERIAL PRIMARY KEY,
    landing_id INT NOT NULL,
    index INT NOT NULL,
    images TEXT,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (landing_id) REFERENCES landing(id) ON DELETE CASCADE
);

CREATE TABLE approach(
    id SERIAL PRIMARY KEY,
    icon TEXT,
    title TEXT NOT NULL,
    description TEXT NOT NULL
);