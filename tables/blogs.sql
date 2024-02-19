CREATE TABLE blogs(
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT,
    content TEXT,
    author TEXT,
    author_title TEXT,
    status cms_status default 'draft',
    userid INT REFERENCES users(id) ON DELETE CASCADE,
    is_archived BOOLEAN default false,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE blog_images(
    id SERIAL PRIMARY KEY,
    blog_id INT NOT NULL,
    image TEXT NOT NULL,
    thumbnail BOOLEAN DEFAULT FALSE
);

CREATE TABLE blog_tags(
    id SERIAL PRIMARY KEY,
    blog_id INT NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
    tag_id INT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    UNIQUE(blog_id, tag_id)
);

