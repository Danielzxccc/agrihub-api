CREATE TABLE about_us(
    id SERIAL PRIMARY KEY,
    banner TEXT NOT NULL,
    about_us TEXT NOT NULL,
    city_commitment TEXT NOT NULL,
    city_image TEXT NOT NULL,
    president_image TEXT NOT NULL,
    president_message TEXT NOT NULL,
    qcu_logo TEXT NOT NULL,
    agrihub_user_logo TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE about_us_carousel(
    id SERIAL PRIMARY KEY,
    image TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);