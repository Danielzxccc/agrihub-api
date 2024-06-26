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
    type_of_farm TEXT DEFAULT 'Community Farm',
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
    is_archived BOOLEAN DEFAULT FALSE,
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
    is_archived BOOLEAN DEFAULT false,
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

CREATE TABLE community_crop_reports(
    id SERIAL PRIMARY KEY,
    farmid INT NOT NULL,
    userid INT NOT NULL,
    crop_id INT,
    planted_qty INT NOT NULL,
    harvested_qty INT,
    withered_crops INT,
    date_planted DATE NOT NULL,
    date_harvested DATE,
    notes TEXT,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
    is_archived BOOLEAN DEFAULT false,
    batch TIMESTAMP,
    last_harvest_id INT REFERENCES community_crop_reports(id) ON DELETE CASCADE,
    kilogram NUMERIC default 0,
    harvested_by INT REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (crop_id) REFERENCES community_farms_crops(id) ON DELETE CASCADE, 
    FOREIGN KEY (farmid) REFERENCES community_farms(id) ON DELETE CASCADE,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
);

-- TODO: new api for existing reported crops

-- kangkong date planted march 2 2024 false false -UPDATE TABLE community_crop_reports set is_existing = false WHERE is_first_batch = true AND farmid = "farm id nung farm head"
-- kangkong date planted march 3 2024 false false 0 10
-- kangkong date planted march 4 2024 false false 0 20 
-- kangkongdate planted march 5 2024 false false 0 40
-- kangkong date planted march 6 2024 false false 0 40

-- kangkong - 1st (date planted march 2 2024)

-- WHERE first_bactch = true AND is_existing = TRUE



CREATE TABLE community_crop_reports_images(
    id SERIAL PRIMARY KEY,
    report_id INT NOT NULL,
    crop_name TEXT NOT NULL,
    imagesrc TEXT NOT NULL,
    FOREIGN KEY (crop_name) REFERENCES crops(name) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (report_id) REFERENCES community_crop_reports(id) ON DELETE CASCADE
);

CREATE TABLE farmer_invitations(
    id SERIAL PRIMARY KEY,
    farmid INT NOT NULL,
    userid INT NOT NULL,
    expiresAt DATE,
    isAccepted BOOLEAN DEFAULT false,
    createdAt timestamp DEFAULT CURRENT_TIMESTAMP,
    updatedAt timestamp DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farmid) REFERENCES community_farms(name) ON DELETE CASCADE,
    FOREIGN KEY (userid) REFERENCES users(id) ON DELETE CASCADE
);

-- CREATE TABLE farmer_applications(
--     id
-- )


