CREATE TABLE event (
    id INT PRIMARY KEY,
    title VARCHAR(255),
    body TEXT,
    time TIMESTAMP,
    max_capacity INT,
    is_for_children BOOLEAN,
    created_at TIMESTAMP
);