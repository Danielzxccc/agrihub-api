CREATE TYPE IF NOT EXISTS tool_request_status AS ENUM ('pending', 'accepted', 'communicating', 'rejected', 'forwarded', 'completed');

CREATE TABLE tool_request(
    id SERIAL PRIMARY KEY,
    tool_requested TEXT NOT NULL,
    quantity_requested INT NOT NULL,
    status tool_request_status DEFAULT 'pending',
    requester_note TEXT NOT NULL,
    client_note TEXT,
    forwarded_to TEXT[],
    accepted_by TEXT[] NOT NULL,
    contact TEXT NOT NULL,
    farm_id INT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (farm_id) REFERENCES community_farms(id) ON DELETE CASCADE
);

CREATE INDEX tool_request_status_index
ON tool_request (status);