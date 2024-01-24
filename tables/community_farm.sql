CREATE TYPE IF NOT EXISTS farm_application_status AS ENUM ('pending', 'approved', 'rejected');

CREATE TABLE farm_applications(
    id SERIAL PRIMARY KEY,
    farm_name TEXT NOT NULL,
    farm_size INT NOT NULL,
    district TEXT NOT NULL,
    location TEXT NOT NULL,
    proof TEXT, --certificate or proof
    farm_actual_images TEXT[] NOT NULL,
    id_type TEXT NOT NULL,
    valid_id TEXT NOT NULL,
    selfie TEXT NOT NULL, --kung legit na tao,
    applicant INT NOT NULL, --user id nung applicant (siya ang magiging farm head kapag na approved ang application),
    status farm_application_status DEFAULT 'pending',
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (applicant) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX farm_application_status_index ON farm_applications (status);

CREATE TABLE community_farms(
    id SERIAL PRIMARY KEY,
    farm_name TEXT NOT NULL,
    location TEXT NOT NULL,
    description TEXT,
    farm_head INT NOT NULL, --userid nung farm head
    district TEXT NOT NULL, 
    size INT, --sqm
    avatar TEXT, --icon ng farm
    cover_photo TEXT, --cover photo sa page nila
    application_id INT NOT NULL, -- relation ng application niya
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (farm_head, name),
    FOREIGN KEY (farm_head) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (application_id) REFERENCES farm_applications(id) ON DELETE CASCADE
);

CREATE TABLE community_farms_crops(
    id SERIAL PRIMARY KEY,
    farm_id INT NOT NULL,
    crop_id INT NOT NULL,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(farm_id, crop_id),
    FOREIGN KEY (farm_id) REFERENCES community_farms(id) ON DELETE CASCADE,
    FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE CASCADE
);

CREATE TABLE community_farms_gallery(
    id SERIAL PRIMARY KEY,
    farm_id INT NOT NULL,
    imagesrc TEXT NOT NULL,
    description TEXT,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES community_farms(id) ON DELETE CASCADE
);




