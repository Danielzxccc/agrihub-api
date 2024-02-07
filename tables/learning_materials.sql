CREATE TABLE learning_materials(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT,
    type TEXT,
    language TEXT,
    status TEXT NOT NULL, --draft
    published_date TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE learning_resource(
    id SERIAL PRIMARY KEY,
    learning_id INT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    resource TEXT,
    type TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (learning_id) REFERENCES learning_materials(id) ON DELETE CASCADE
);

CREATE TABLE learning_credits(
    id SERIAL PRIMARY KEY,
    learning_id INT NOT NULL,
    name TEXT NOT NULL,
    title TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (learning_id) REFERENCES learning_materials(id) ON DELETE CASCADE
);

CREATE TABLE learning_tags(
    id SERIAL PRIMARY KEY,
    learning_id INT NOT NULL REFERENCES learning_materials(id) ON DELETE CASCADE,
    tag_id INT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE(learning_id, tag_id)
);