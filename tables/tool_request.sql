CREATE TYPE IF NOT EXISTS tool_request_status AS ENUM ('pending', 'accepted', 'communicating', 'rejected', 'forwarded', 'completed');

CREATE TABLE tool_request(
    id SERIAL PRIMARY KEY,
    tool_requested TEXT NOT NULL,
    quantity_requested INT NOT NULL,
    status tool_request_status DEFAULT,
    requester_note TEXT NOT NULL,
    client_note TEXT,
    forwarded_to TEXT[],
    accepted_by TEXT[] NOT NULL,
    farm_id INT NOT NULL,
    FOREIGN KEY (farm_id) REFERENCES community_farms(id) ON DELETE CASCADE
);