CREATE TABLE event (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    body TEXT,
    time TIMESTAMP,
    max_capacity INT,
    is_for_children BOOLEAN,
    is_recurring BOOLEAN,
    created_at TIMESTAMP
);