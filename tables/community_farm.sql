CREATE TYPE IF NOT EXISTS farm_application_status AS ENUM ('pending', 'approved');

CREATE TABLE farm_applications(
    id SERIAL PRIMARY KEY,
    farm_name TEXT NOT NULL,
    farm_size INT NOT NULL,
    district TEXT NOT NULL,
    proof TEXT, --certificate or proof
    farm_actual_images TEXT[] NOT NULL,
    id_type TEXT NOT NULL,
    valid_id TEXT NOT NULL,
    selfie TEXT NOT NULL, --kung legit na tao,
    applicant INT NOT NULL, --user id nung applicant (siya ang magiging farm head kapag na approved ang application),
    status farm_application_status DEFAULT 'pending',
    FOREIGN KEY (applicant) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX farm_application_status_index ON farm_applications (status);