CREATE TABLE user (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255),
    password_hash VARCHAR(255),
    role ENUM('owner', 'customer'),
    person_id INT,
    FOREIGN KEY (person_id) REFERENCES person(id)
);