CREATE TABLE user (
    id INT PRIMARY KEY,
    email VARCHAR(255),
    password_hash VARCHAR(255),
    role ENUM('owner', 'customer'),
    created_at TIMESTAMP,
    person_id INT,
    FOREIGN KEY (person_id) REFERENCES person(id)
);