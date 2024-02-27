CREATE TYPE IF NOT EXISTS request_status AS ENUM ('accepted', 'pending', 'rejected');

CREATE TABLE seedling_requests(
    id SERIAL PRIMARY KEY,
    crop_id INT,
    other TEXT,
    farm_id INT NOT NULL,
    quantity_request INT NOT NULL,
    quantity_approve INT,
    status request_status DEFAULT 'pending',
    delivery_date DATE,
    note TEXT,
    createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (crop_id) REFERENCES crops(id) ON DELETE CASCADE,
    FOREIGN KEY (farm_id) REFERENCES community_farms(id) ON DELETE CASCADE
);