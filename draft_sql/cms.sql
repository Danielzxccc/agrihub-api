CREATE TABLE about_cms(
    id SERIAL PRIMARY KEY
    bg_image TEXT,
    banner TEXT,
    partnership_img TEXT,
    qc_image TEXT,
    president_image TEXT,
    org_chart TEXT,
    description TEXT, -- Paragraphs
    mission TEXT,
    vision TEXT,
    partnership TEXT,
    commitment TEXT,
    president_message TEXT
)

CREATE TABLE about_gallery(
    id SERIAL PRIMARY KEY
    imagesrc TEXT,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
    cms_id INT NOT NULL,
    FOREIGN KEY (cms_id) REFERENCES about_cms(id) ON DELETE CASCADE
)
